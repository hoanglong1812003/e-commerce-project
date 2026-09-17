const prisma = require("../config/db");
const { buildPaymentUrl, verifyReturn } = require("../utils/vnpay");
const env = require("../config/env");

async function createPaymentUrl(req, res, next) {
  try {
    const orderId = Number(req.body.orderId);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
    if (order.status !== "PENDING") {
      return res.status(400).json({ message: `Order is already ${order.status}` });
    }

    const ipAddr =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const { paymentUrl, txnRef } = buildPaymentUrl({
      orderId: order.id,
      amount: Number(order.totalAmount),
      ipAddr,
    });

    await prisma.order.update({ where: { id: order.id }, data: { vnpTxnRef: txnRef } });

    res.json({ paymentUrl });
  } catch (err) {
    next(err);
  }
}

async function handleReturn(req, res, next) {
  try {
    const valid = verifyReturn(req.query);
    const txnRef = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    const order = await prisma.order.findUnique({ where: { vnpTxnRef: txnRef } });
    if (!valid || !order) {
      return res.redirect(`${env.frontendUrl}/orders?payment=invalid`);
    }

    const status = responseCode === "00" ? "PAID" : "FAILED";
    await prisma.order.update({ where: { id: order.id }, data: { status } });

    res.redirect(`${env.frontendUrl}/orders/${order.id}?payment=${status.toLowerCase()}`);
  } catch (err) {
    next(err);
  }
}

// VNPay server-to-server IPN — must reply with the exact { RspCode, Message } contract.
async function handleIpn(req, res) {
  try {
    const valid = verifyReturn(req.query);
    if (!valid) return res.json({ RspCode: "97", Message: "Invalid signature" });

    const txnRef = req.query.vnp_TxnRef;
    const order = await prisma.order.findUnique({ where: { vnpTxnRef: txnRef } });
    if (!order) return res.json({ RspCode: "01", Message: "Order not found" });

    if (order.status !== "PENDING") {
      return res.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    const amountMatches = Math.round(Number(order.totalAmount) * 100) === Number(req.query.vnp_Amount);
    if (!amountMatches) return res.json({ RspCode: "04", Message: "Amount mismatch" });

    const status = req.query.vnp_ResponseCode === "00" ? "PAID" : "FAILED";
    await prisma.order.update({ where: { id: order.id }, data: { status } });

    res.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (err) {
    res.json({ RspCode: "99", Message: "Unknown error" });
  }
}

module.exports = { createPaymentUrl, handleReturn, handleIpn };

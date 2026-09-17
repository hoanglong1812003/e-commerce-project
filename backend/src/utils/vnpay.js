const crypto = require("crypto");
const qs = require("qs");
const env = require("../config/env");

function pad(n) {
  return n.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

// Builds a signed VNPay sandbox payment URL for a given order.
// https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
function buildPaymentUrl({ orderId, amount, ipAddr }) {
  const now = new Date();
  const txnRef = `${orderId}-${now.getTime()}`;

  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: env.vnpay.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan don hang #${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(amount * 100),
    vnp_ReturnUrl: env.vnpay.returnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: formatDate(now),
  };

  params = sortObject(params);
  const signData = qs.stringify(params, { encode: false });
  const hmac = crypto.createHmac("sha512", env.vnpay.hashSecret);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  params.vnp_SecureHash = secureHash;

  const paymentUrl = `${env.vnpay.url}?${qs.stringify(params, { encode: false })}`;
  return { paymentUrl, txnRef };
}

// Verifies the signature VNPay attaches to return/IPN callbacks.
function verifyReturn(query) {
  const params = { ...query };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac("sha512", env.vnpay.hashSecret);
  const computedHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return computedHash === secureHash;
}

module.exports = { buildPaymentUrl, verifyReturn };

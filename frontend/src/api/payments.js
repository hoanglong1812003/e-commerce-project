import client from "./client";

export const createVnpayPaymentUrl = (orderId) =>
  client.post("/payments/vnpay/create-payment-url", { orderId }).then((r) => r.data);

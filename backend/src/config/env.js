require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  vnpay: {
    tmnCode: process.env.VNP_TMN_CODE,
    hashSecret: process.env.VNP_HASH_SECRET,
    url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.VNP_RETURN_URL || "http://localhost:4000/api/payments/vnpay/return",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  },
};

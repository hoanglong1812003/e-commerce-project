const express = require("express");
const ctrl = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/vnpay/create-payment-url", authenticate, ctrl.createPaymentUrl);
router.get("/vnpay/return", ctrl.handleReturn);
router.get("/vnpay/ipn", ctrl.handleIpn);

module.exports = router;

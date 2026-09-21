const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { metricsMiddleware, metricsHandler } = require("./utils/metrics");

const app = express();

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/metrics", metricsHandler);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

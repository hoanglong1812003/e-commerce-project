const client = require("prom-client");

// Collect default Node.js process/runtime metrics (CPU, memory, event loop lag, GC...)
client.collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

/**
 * Express middleware that records request count and latency for every request.
 * Uses req.route?.path when available so metric labels stay low-cardinality
 * (e.g. "/api/products/:id" instead of "/api/products/123").
 */
function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : req.originalUrl.split("?")[0];
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    httpRequestDuration.observe(labels, durationSeconds);
    httpRequestTotal.inc(labels);
  });

  next();
}

async function metricsHandler(req, res) {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
}

module.exports = { metricsMiddleware, metricsHandler };

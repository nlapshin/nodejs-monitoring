import client from 'prom-client'

const register = new client.Registry();

client.collectDefaultMetrics({
  app: 'node-application-monitoring',
  prefix: 'node_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register
});

const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2]
});

register.registerMetric(httpRequestTimer);

export { register, httpRequestTimer }

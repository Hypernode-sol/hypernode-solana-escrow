
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const jobCounter = new client.Counter({
  name: 'hypernode_jobs_started_total',
  help: 'Total number of Hypernode jobs started'
});

const releaseCounter = new client.Counter({
  name: 'hypernode_jobs_released_total',
  help: 'Total number of Hypernode payments released'
});

register.registerMetric(jobCounter);
register.registerMetric(releaseCounter);

module.exports = {
  register,
  jobCounter,
  releaseCounter
};

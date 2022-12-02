import express from 'express';
import delayRandom from 'delay-random';

import env from './env.js'
import { makeLogger } from './logger.js'
import { register, httpRequestTimer } from './metrics.js'

const PORT = env.PORT
const app = express();
const logger = makeLogger(env.SENTRY_DSN)

app.use((req, res, next) => {
  const requestTimer = httpRequestTimer.startTimer();

  res.on("finish", () => {
    requestTimer({ route: req.route?.path, code: res.statusCode, method: req.method })
  });

  next()
})

app.get('/', async (req, res) => {
  await delayRandom(100, 2000)

  res.send('Hello world')
});

app.get('/slow', async (req, res) => {
  await delayRandom(2000, 5000)

  res.send('Hello world')
});

app.get('/with-error', async (req, res) => {
  try {
    await delayRandom(100, 2000)

    if (Math.random() >= 0.9) {
      throw new Error('Random error')
    }

    res.send('Hello world')
  } catch(err) {
    logger.error(err)

    res.send('Hello world with error')
  }
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(PORT, (err) => {
  if (err) {
    logger.error(err)

    return;
  }

  logger.info(`server started on ${PORT} port`)
})

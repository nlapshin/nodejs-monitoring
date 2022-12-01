import express from 'express';
import delayRandom from 'delay-random';

import { register, httpRequestTimer } from './metrics.js'

const PORT = process.env.PORT || 5555
const app = express();

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

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err)

    return;
  }

  console.log(`server start on ${PORT}`)
})

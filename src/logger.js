import pino from 'pino'

export function makeLogger(sentryDsn = '') {
  const targets = [
    { target: 'pino-pretty' }
  ]

  targets.push({
    target: 'pino/file',
    options: {
      destination: '/tmp/node-monitoring/logs.log', mkdir: true
    }
  })

  targets.push({
    target: 'pino-sentry-transport',
    options: {
      sentry: {
        dsn: sentryDsn,
        tracesSampleRate: 1.0
      },
      minLevel: 40
    }
  })

  const transport = pino.transport({ targets })

  return pino(transport)
}

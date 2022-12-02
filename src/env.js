import dotenv from 'dotenv'
import { cleanEnv, str, num } from 'envalid'

dotenv.config()

const env = cleanEnv(process.env, {
  PORT: num({ default: 5555 }),
  SENTRY_DSN: str({ default: '' }),
})

export default env

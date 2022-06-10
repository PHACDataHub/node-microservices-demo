import 'dotenv/config'
import postgres from 'postgres'
import { Server } from './src/Server.js'
import { schema } from './src/schema.js'

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_PASS,
  DB_USER,
  MAX_COMPLEXITY = 25,
} = process.env

const sql = postgres({
  host: DB_HOST,
  port: 5432,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
})

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
;(async () => {
  const server = new Server({
    schema,
    maxComplexity: MAX_COMPLEXITY,
    context: { sql },
  })
  server.listen({ port: PORT, host: HOST }, () =>
    console.log(`🚀 Node-demo listening on ${HOST}:${PORT}`),
  )
})()

import express from 'express'
import { createServer } from '@graphql-yoga/node'

export function Server({
  schema,
  context = {
    log: (...args) => console.log(args),
  },
}) {
  const app = express()

  const graphQLServer = createServer({
    schema,
    context,
  })

  app.use('/', graphQLServer)

  return app
}

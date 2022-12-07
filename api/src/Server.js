import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'

export function Server({
  schema,
  context = {
    log: (...args) => console.log(args),
  },
}) {
  const yoga = createYoga({ schema, context, graphqlEndpoint: '/' })
  const server = createServer(yoga)

  return server
}

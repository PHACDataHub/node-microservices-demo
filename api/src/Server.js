import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { createComplexityRule } from 'graphql-query-complexity'

// https://github.com/slicknode/graphql-query-complexity/issues/65
function simpleEstimator({ defaultComplexity = 1 }) {
  return (args) => {
    return defaultComplexity + args.childComplexity
  }
}

export function Server({
  schema,
  root: rootValue,
  maximumComplexity = 25,
  context = {},
}) {
  const server = express()

  server.use(
    '/',
    graphqlHTTP(async (_req, _res, { variables }) => ({
      schema,
      rootValue,
      context,
      graphiql: true,
      validationRules: [
        createComplexityRule({
          estimators: [
            // Configure your estimators
            simpleEstimator({ defaultComplexity: 1 }),
          ],
          maximumComplexity,
          variables,
        }),
      ],
    })),
  )

  return server
}

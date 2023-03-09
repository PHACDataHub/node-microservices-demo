import { makeExecutableSchema } from '@graphql-tools/schema'
import request from 'supertest'
import { Server } from '../Server.js'
// https://github.com/facebook/jest/issues/9430#issuecomment-616232029
// eslint-disable-next-line
import { jest } from '@jest/globals' // support for ESM modules

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

describe('Server', () => {
  describe('given a schema and root', () => {
    it('returns an express server', async () => {
      const server = await Server({ schema })

      const response = await request(server)
        .post('/graphql')
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        })

      expect(response.body).toEqual({ data: { hello: 'Hello world!' } })
    })
  })
})

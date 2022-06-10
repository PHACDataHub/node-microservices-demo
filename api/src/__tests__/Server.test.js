import request from 'supertest'
import { Server } from '../Server.js'
// https://github.com/facebook/jest/issues/9430#issuecomment-616232029
// eslint-disable-next-line
import { jest } from '@jest/globals' // support for ESM modules

import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!'
  },
}

describe('Server', () => {
  describe('given a schema and root', () => {
    it('returns an express server', async () => {
      const server = new Server({ schema, root })

      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        })

      expect(response.body).toEqual({ data: { hello: 'Hello world!' } })
    })
  })

  describe('given an overly complex query', () => {
    it('rejects it', async () => {
      const server = new Server({ schema, root, maximumComplexity: 1 })

      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{hello hello}',
        })

      const [err] = response.body.errors
      expect(err.message).toEqual(
        'The query exceeds the maximum complexity of 1. Actual complexity is 2',
      )
    })
  })

  describe('given a simple query', () => {
    it('executes it', async () => {
      const server = new Server({ schema, root, maximumComplexity: 1 })

      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        })

      expect(response.body).not.toHaveProperty('errors')
    })
  })
})

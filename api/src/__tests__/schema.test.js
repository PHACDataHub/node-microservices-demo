// eslint-disable-next-line
import { jest } from '@jest/globals' // support for ESM modules
import { schema } from '../schema.js'
import { graphql } from 'graphql'

describe('schema', () => {
  describe('query', () => {
    describe('hello', () => {
      it('includes a hello world field for testing', async () => {
        const response = await graphql({
          schema,
          source: '{hello}',
        })

        expect(response).toEqual({ data: { hello: 'Hello world!' } })
      })
    })

    describe('bugs', () => {
      it('returns an array of bugs', async () => {
        const bugs = [{ id: 1, title: 'asdf', description: 'asdf' }]
        const response = await graphql({
          schema,
          source: '{bugs {id title description}}',
          contextValue: { sql: () => Promise.resolve(bugs) },
        })

        expect(response).toEqual({ data: { bugs } })
      })
    })

    describe('bug', () => {
      it('returns a bug by id', async () => {
        const bug = { id: 1, title: 'asdf', description: 'asdf' }
        const response = await graphql({
          schema,
          source: '{bug(id: 1) {id title description}}',
          contextValue: { sql: () => [bug] },
        })

        expect(response).toEqual({ data: { bug } })
      })

      it('returns null when no record is returned', async () => {
        const response = await graphql({
          schema,
          source: '{bug(id: 2) {id title description}}',
          contextValue: { sql: () => Promise.resolve([]) },
        })

        expect(response).toEqual({ data: { bug: null } })
      })
    })
  })
})

describe('schema', () => {
  describe('mutation', () => {
    describe('report', () => {
      it('rejects javascript as a url scheme', async () => {
        const bug = {
          title: 'asdf',
          description: 'asdf',
          foundOn: '2022-05-01',
          status: 'RESOLVED',
          url: 'javascript:alert("xss")',
        }
        const response = await graphql({
          schema,
          source: `
						mutation BugReport($report: BugReport!) {
              bug(report: $report) {
                id
                title
                description
								foundOn
								status
								url
              }
            }
          `,
          contextValue: { sql: () => [bug] },
          variableValues: { report: bug },
        })

        expect(response).toHaveProperty('errors')
        const [err] = response.errors
        expect(err.message).toEqual('Dangerous url schemes are not allowed.')
      })

      it('rejects data as a url scheme', async () => {
        const bug = {
          title: 'asdf',
          description: 'asdf',
          foundOn: '2022-05-01',
          status: 'RESOLVED',
          url: 'data:text/html,<script>alert("xss");</script>',
        }
        const response = await graphql({
          schema,
          source: `
						mutation BugReport($report: BugReport!) {
              bug(report: $report) {
                id
                title
                description
								foundOn
								status
								url
              }
            }
          `,
          contextValue: { sql: () => [bug] },
          variableValues: { report: bug },
        })

        expect(response).toHaveProperty('errors')
        const [err] = response.errors
        expect(err.message).toEqual('Dangerous url schemes are not allowed.')
      })

      it('rejects vbscript as a url scheme', async () => {
        const bug = {
          title: 'asdf',
          description: 'asdf',
          foundOn: '2022-05-01',
          status: 'RESOLVED',
          url: 'vbscript:window.external.AddFavorite("http://cyber.gc.ca","Canadian Centre for Cyber Security")',
        }
        const response = await graphql({
          schema,
          source: `
						mutation BugReport($report: BugReport!) {
              bug(report: $report) {
                id
                title
                description
								foundOn
								status
								url
              }
            }
          `,
          contextValue: { sql: () => [bug] },
          variableValues: { report: bug },
        })

        expect(response).toHaveProperty('errors')
        const [err] = response.errors
        expect(err.message).toEqual('Dangerous url schemes are not allowed.')
      })

      it('accepts a well formatted bug report', async () => {
        const bug = {
          title: 'asdf',
          description: 'asdf',
          foundOn: '2022-05-01',
          status: 'RESOLVED',
          url: 'https://example.com/vuln',
        }
        const response = await graphql({
          schema,
          source: `
						mutation BugReport($report: BugReport!) {
              bug(report: $report) {
                id
                title
                description
								foundOn
								status
								url
              }
            }
          `,
          contextValue: {
            sql: () => [
              {
                id: 2,
                title: 'asdf',
                description: 'asdf',
								foundon: '2022-05-01T00:00:00.000Z',
                status: 'resolved', // Status ENUM translates to lowercase
                url: 'https://example.com/vuln',
              },
            ],
          },
          variableValues: { report: bug },
        })

        expect(response).toEqual({
          data: {
            bug: {
              id: 2,
              title: 'asdf',
              description: 'asdf',
              foundOn: '2022-05-01',
              status: 'RESOLVED',
              url: 'https://example.com/vuln',
            },
          },
        })
      })
    })
  })
})

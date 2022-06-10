import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLError,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql'
import { Bug } from './Bug.js'
import { BugReport } from './BugReport.js'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      bugs: {
        description: 'A list of all our known bugs',
        type: new GraphQLList(Bug),
        resolve(_parent, _args, { sql }) {
          return sql`select * from bugs;`
        },
      },
      // Defense in depth:
      bug: {
        description: 'The details of a specific bug',
        args: {
          // `bug` accepts an `id` argument
          id: {
            description: 'The id of the requested bug',
            // First line of defense:
            // Use the GraphQL schema to restrict inputs to the resolve function
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        // GraphQL will only execute this resolver function with valid inputs: `{ bug(id: 1){ id } }`
        async resolve(_parent, { id }, { sql }) {
          // Second line of defense:
          // Simple queries, with SQL injection protection using JS Tagged Template Literal syntax.
          const results = await sql`select * from bugs where id = ${id};`
          if (results.length === 0) {
            return null
          } else {
            return results[0]
          }
        },
        // Third line of defense: Use the GraphQL schema to constrain outputs from the resolve function
        type: Bug,
      },
      hello: {
        type: GraphQLString,
        resolve(_parent, _args, _context, _info) {
          return 'Hello world!'
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      bug: {
        type: Bug,
        args: {
          report: { type: new GraphQLNonNull(BugReport) },
        },
        async resolve(_source, { report }, { sql }) {
          const { title, description, foundOn, status, url } = report
          // It's a URL, but is it a safe URL?
          // We don't want to pass dangerous stuff downstream.
          // TODO: this should be part of the GraphQLURL type
          if (
            url.protocol === 'javascript:' ||
            url.protocol === 'data:' ||
            url.protocol === 'vbscript:'
          ) {
            return new GraphQLError('Dangerous url schemes are not allowed.')
          }

          const results = await sql`
					    INSERT INTO bugs
					      (title, description, foundon, status, url)
					    values
					      (${title}, ${description}, ${foundOn}, ${status}, ${url})
					    returning *
					  `
          return results[0]
        },
      },
    },
  }),
})

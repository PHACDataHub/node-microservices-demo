import { GraphQLInputObjectType, GraphQLString } from 'graphql'
import { GraphQLDate, GraphQLURL } from 'graphql-scalars'
import { Status } from './Status.js'

export const BugReport = new GraphQLInputObjectType({
  name: 'BugReport',
  description: 'The details of a bug that has been found',
  fields: {
    title: {
      type: GraphQLString,
      description: 'A short title for this bug report',
    },
    description: {
      type: GraphQLString,
      description: "A detailed description of the bug you're reporting",
    },
    foundOn: { type: GraphQLDate, description: 'The date the bug was found' },
    status: {
      type: Status,
      description: "The status of the bug you're reporting",
    },
    url: {
      type: GraphQLURL,
      description: 'The exact URL where the bug is to be found',
    },
  },
})

import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDate } from 'graphql-scalars'
import { Status } from './Status.js'

export const Bug = new GraphQLObjectType({
  name: 'Bug',
  fields: {
    id: {
      type: GraphQLInt,
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    foundOn: {
      type: GraphQLDate,
      resolve(parent) {
        if (parent.foundon.toString().match(/^\d{4}-\d{2}-\d{2}T/)) {
          return parent.foundon.split('T')[0]
        } else {
          return parent.foundon
        }
      },
    },
    url: {
      type: GraphQLString,
    },
    status: {
      type: Status,
    },
  },
})

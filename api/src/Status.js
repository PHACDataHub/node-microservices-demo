import { GraphQLEnumType } from 'graphql'

export const Status = new GraphQLEnumType({
  name: 'Status',
  values: {
    INVESTIGATING: { value: 'investigating' },
    ACKNOWLEDGED: { value: 'acknowledged' },
    RESOLVED: { value: 'resolved' },
  },
})

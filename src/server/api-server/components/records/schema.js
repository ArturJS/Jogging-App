export default `
  type Record {
    id: ID!
    date: Long!
    distance: Float!
    time: Int!
    averageSpeed: Float!
  }

  input RecordInput {
    date: Long!
    distance: Float!
    time: Int!
  }

  input Filter {
    startDate: Long
    endDate: Long
  }

  extend type Query {
    records(filter: Filter): [Record]
    record(id: ID!): Record
  }

  extend type Mutation {
    addRecord(record: RecordInput!): Record
    updateRecord(id: ID!, record: RecordInput!): Record
    deleteRecord(id: ID!): Boolean
  }
`;

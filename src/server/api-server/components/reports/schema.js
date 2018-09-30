export default `
  type Report {
    week: Int!
    averageDistance: Float!
    averageSpeed: Float!
  }

  extend type Query {
    reports: [Report]
  }
`;

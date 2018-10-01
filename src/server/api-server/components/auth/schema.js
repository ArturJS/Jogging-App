export default `
  type User {
    firstName: String!
    lastName: String!
    email: String!
  }

  extend type Query {
    userData: User
  }

  extend type Mutation {
    signIn(
      email: String!
      password: String!
    ): Boolean

    signUp(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      repeatPassword: String!
    ): Boolean

    signOut: Boolean
  }
`;

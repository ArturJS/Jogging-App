export default `
  input SignIn {
    email: String!
    password: String!
  }

  input SignUp {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    repeatPassword: String!
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
  }

  extend type Query {
    userData: User
  }

  extend type Mutation {
    signIn(signIn: SignIn!): Boolean
    signOut: Boolean
    signUp(signUp: SignUp!): Boolean
  }
`;

import { gql } from 'apollo-boost';

export const IS_LOGGED_IN = gql`
  query IsLoggedInQuery {
    authState @client {
      isLoggedIn
    }
  }
`;

export const RECORD_QUERY = gql`
  query Record($id: ID!) {
    record(id: $id) @client {
      id
      date
      distance
      time
      averageSpeed
    }
  }
`;

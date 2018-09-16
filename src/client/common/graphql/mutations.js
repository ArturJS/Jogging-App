import { gql } from 'apollo-boost';

export const UPDATE_IS_LOGGED_IN = gql`
  mutation UpdateIsLoggedIn($isLoggedIn: Boolean!) {
    updateIsLoggedIn(isLoggedIn: $isLoggedIn) @client
  }
`;

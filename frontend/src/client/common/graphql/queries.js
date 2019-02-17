import { gql } from 'apollo-boost';

export const IS_LOGGED_IN = gql`
    query {
        authState @client {
            isLoggedIn
        }
    }
`;

export const RECORD_QUERY = gql`
    query($id: ID!) {
        record(id: $id) @client {
            id
            date
            distance
            time
            averageSpeed
        }
    }
`;

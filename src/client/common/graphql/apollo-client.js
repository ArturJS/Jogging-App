import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import fetch from 'isomorphic-fetch';

export const createApolloClient = ({ isLoggedIn = false, cookie } = {}) => {
  const cache = __CLIENT__
    ? new InMemoryCache().restore(window.__APOLLO_STATE__)
    : new InMemoryCache();
  const defaultClientState = __SERVER__
    ? {
        authState: {
          __typename: 'AuthState',
          isLoggedIn
        }
      }
    : null;

  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      withClientState({
        cache,
        defaults: defaultClientState,
        resolvers: {
          Query: {
            record: (_, { id }, { cache }) => {
              return cache.data.data[`record:${id}`];
            }
          }
        }
      }),
      createHttpLink({
        uri: __SERVER__ ? 'http://localhost:3000/graphql' : '/graphql',
        fetch,
        headers: {
          cookie
        }
      })
    ])
  });
};

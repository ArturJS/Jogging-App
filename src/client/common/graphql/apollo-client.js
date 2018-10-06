import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import fetch from 'isomorphic-fetch';

// export const createApolloClient = ({
//   isLoggedIn = false,
//   cookie,
//   baseUrl = '/graphql'
// } = {}) => {
//   const cache = process.browser
//     ? new InMemoryCache().restore(window.__APOLLO_STATE__)
//     : new InMemoryCache();
//   const defaultClientState = !process.browser
//     ? {
//         authState: {
//           __typename: 'AuthState',
//           isLoggedIn
//         }
//       }
//     : null;

//   return new ApolloClient({
//     cache,
//     link: ApolloLink.from([
//       withClientState({
//         cache,
//         defaults: defaultClientState,
//         resolvers: {
//           Query: {
//             record: (_, { id }, { cache }) => {
//               return cache.data.data[`record:${id}`];
//             }
//           }
//         }
//       }),
//       createHttpLink({
//         uri: baseUrl,
//         fetch,
//         headers: {
//           cookie
//         }
//       })
//     ])
//   });
// };

////////////////////////////////////////
///////////////////////////////////////

let apolloClient = null;

function create(initialState, { cookie, isLoggedIn = false } = {}) {
  const cache = new InMemoryCache().restore(initialState || {});
  const defaultClientState = !process.browser
    ? {
        authState: {
          __typename: 'AuthState',
          isLoggedIn
        }
      }
    : null;

  return new ApolloClient({
    link: ApolloLink.from([
      withClientState({
        cache,
        defaults: defaultClientState,
        resolvers: {
          // todo extract into separate file client resolvers
          Query: {
            record: (_, { id }, { cache }) => {
              return cache.data.data[`record:${id}`];
            }
          }
        }
      }),
      createHttpLink({
        uri: 'http://localhost:3000/graphql', // todo fix
        fetch,
        headers: {
          cookie
        }
      })
    ]),
    cache
  });
}

export const initApollo = (initialState, options) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
};

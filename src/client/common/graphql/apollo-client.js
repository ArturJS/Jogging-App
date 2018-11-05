import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import fetch from 'isomorphic-unfetch';
import resolvers from './resolvers';

let apolloClient = null;

function create(
    initialState,
    { cookie, isLoggedIn = false, baseUrl = '/graphql' } = {}
) {
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
                resolvers
            }),
            createHttpLink({
                uri: baseUrl,
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

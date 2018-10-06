import React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import 'react-table/react-table.css';
import RootShell from '../common/shells/RootShell';
import withApollo from '../common/graphql/with-apollo';

class BaseApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <RootShell>
            <Component {...pageProps} />
          </RootShell>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(BaseApp);

/* eslint-disable react/prop-types */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

import App from './components/app/app';
import localStateLink from './resolvers/local-state';

const GRAPHQL_SERVER_ENDPOINT = '/graphql';
const cache = new InMemoryCache();

const client = new ApolloClient({
    link: ApolloLink.from([localStateLink(cache), new BatchHttpLink({ uri: GRAPHQL_SERVER_ENDPOINT })]),
    cache
});

export const Root = () => (
    <BrowserRouter>
        <ApolloProvider client={ client }>
            <App />
        </ApolloProvider>
    </BrowserRouter>
);

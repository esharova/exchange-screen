/* eslint-disable react/jsx-filename-extension */
import express from 'express';
import Boom from 'boom';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import config from 'config';

import { StaticRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { renderToString } from 'react-dom/server';

import App from '../../components/app/app';

const router = express.Router();

function prepareClient() {
    return new ApolloClient({
        ssrMode: true,
        link: new SchemaLink({}),
        cache: new InMemoryCache()
    });
}

router.get(/^\/.*/, function (request, res) {
    const template = handlebars.compile(
        fs.readFileSync(path.join(process.cwd(), '.build', 'index.hbs'), 'utf8')
    );

    const contextRoot = config.get('client.contextRoot');

    const context = {};

    if (context.url) {
        return res.redirect(context.url);
    }

    const appCode = (
        <ApolloProvider client={ prepareClient() } >
            <StaticRouter location={ request.url } context={ context } >
                <App />
            </StaticRouter>
        </ApolloProvider>
    );

    let page;

    try {
        page = template({
            contextRoot: `${contextRoot}`,
            assetsPath: config.get('assetsPath'),
            content: renderToString(appCode)
        });
    } catch (error) {
        console.error('error during render process', error);
        return Boom.badImplementation();
    }

    return res.send(page);
});

export default router;

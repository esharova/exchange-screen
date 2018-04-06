const env = process.env.NODE_ENV || 'dev';

const clientConfig = {
    env,
    contextRoot: process.env.CONTEXT_ROOT || '/some_context_root_path',
};

module.exports = {
    proxyAssets: {
        host: 'localhost',
        port: 9090
    },
    devtools: true,
    useMocks: false,

    assetsPath: '',

    csp: {},

    buildConfig: {
        targetDir: '.build',
        assetsDir: 'assets'
    },

    server: {
        requestTimeout: 20000,
        cacheMaxAge: 30000,
        port: 8080,
        api: {
            graphql: {
                uri: '/graphql'
            },
            graphiql: {
                uri: '/graphiql'
            },
            currencyRates: {
                uri: 'http://localhost:3001/currencyRates',
                method: 'GET'
            },
            accounts: {
                uri: 'http://localhost:3001/accounts',
                method: 'GET'
            }
        }
    },

    client: clientConfig
};

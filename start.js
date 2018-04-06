Error.stackTraceLimit = 30;

const config = require('config');
const respawn = require('respawn');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const webpackBackendConfig = require('./webpack.backend.config.js');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const HOT_LOADER = !!process.env.HOT_LOADER;
const PROXY_ASSETS = config.get('proxyAssets');

webpackConfig.entry = Object.keys(webpackConfig.entry).reduce((result, item) => {
    result[item] = [
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:' + PROXY_ASSETS.port
    ];

    if (HOT_LOADER) {
        result[item] = result[item].concat('react-hot-loader/patch');
    }

    result[item] = result[item].concat(webpackConfig.entry[item]);

    return result;
}, {});

if (HOT_LOADER) {
    webpackConfig.module.rules
        .filter(loader => loader.loader === 'babel-loader')
        .forEach(loader => {
            if (loader.query && loader.query.plugins) {
                loader.query.plugins = ['react-hot-loader/babel'].concat(loader.query.plugins);
            }
        });
}

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.plugins.push(new ProgressBarPlugin());

const frontendCompiler = webpack(webpackConfig);
const frontendServer = new WebpackDevServer(frontendCompiler, {
    contentBase: webpackConfig.output.path,
    hot: true,
    quiet: false,
    noInfo: true,
    inline: true,
    lazy: false,
    filename: webpackConfig.output.filename,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: webpackConfig.output.publicPath,
    headers: { 'X-Custom-Header': 'yes', 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true }
});

frontendServer.listen(PROXY_ASSETS.port, PROXY_ASSETS.host, () => {
    console.log(`Frontend server running at http://${PROXY_ASSETS.host}:${PROXY_ASSETS.port}...`);
});

const backendCompiler = webpack(webpackBackendConfig);

const STATS_OPTIONS = {
    assets: false,
    colors: true,
    version: false,
    modules: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    reasons: true,
    cached: true,
    chunkOrigins: true
};

var lastHash = null;
function backendCompilerCallback(error, stats) {
    if (error) {
        lastHash = null;
        console.error(error.stack || error);
        if (error.details) {
            console.error(error.details);
        }
        return;
    }

    if (stats.hash !== lastHash) {
        lastHash = stats.hash;
        process.stdout.write(stats.toString(STATS_OPTIONS) + '\n');
    }
}

backendCompiler.plugin('compile', () => console.log('Building server...'));

var monitor;
backendCompiler.plugin('done', () => {
    try {
        console.log('Restarting server...');
        if (!monitor) {
            monitor = respawn(['node', '--harmony', './.build/server.js'], {
                cwd: '.',
                maxRestarts: -1,
                sleep: 100,
                kill: 1000,
                stdio: [
                    process.stdin,
                    process.stdout,
                    process.stderr
                ]
            });

            monitor.start();
        } else {
            monitor.stop(() => monitor.start());
        }
    } catch (error) {
        console.error(error.toString());
    }
});

backendCompiler.watch(100, backendCompilerCallback);
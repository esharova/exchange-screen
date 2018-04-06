const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const BUILD_PATH = './.build/';
const IS_PRODUCTION = (process.env.NODE_ENV === 'production');
const WEBPACK_CONFIG_TEMPLATE = require('arui-presets/webpack.base');

const webpackConfig = merge.smart(
    WEBPACK_CONFIG_TEMPLATE,
    {
        target: 'node',
        node: {
            __filename: true,
            __dirname: true
        },
        entry: ['./src/server/server.js'],
        output: {
            path: path.resolve(__dirname, BUILD_PATH),
            publicPath: '/',
            filename: 'server.js'
        },
        externals: [nodeExternals({
            whitelist: [/^arui-feather/, /^react-responsive-carousel/]
        })],
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/\.css$/, 'node-noop')
        ]
    },
    IS_PRODUCTION ? {} : {
        devtool: 'inline-source-map',
        plugins: [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();',
                raw: true,
                entryOnly: false
            })
        ]
    }
);


module.exports = webpackConfig;
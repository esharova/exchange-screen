const path = require('path');
const config = require('config');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const PROXY_ASSETS = config.get('proxyAssets');
const ASSETS_PATH = 'assets/';
const BUILD_PATH = './.build/';
const WEBPACK_CONFIG_TEMPLATE = require('arui-presets/webpack.base');
const WEBPACK_CONFIG_TEMPLATE_PRODUCTION = require('arui-presets/webpack.production');
const WEBPACK_CONFIG_TEMPLATE_DEVELOPMENT = require('arui-presets/webpack.development');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const webpackConfig = merge.smart(
    WEBPACK_CONFIG_TEMPLATE,
    {
        entry: {
            index: [
                './node_modules/arui-feather/polyfills.js',
                './src/index.jsx'
            ]
        },
        output: {
            path: path.resolve(__dirname, BUILD_PATH, ASSETS_PATH),
            publicPath: IS_PRODUCTION ? '' : `http://${PROXY_ASSETS.host}:${PROXY_ASSETS.port}/${ASSETS_PATH}`,
            filename: IS_PRODUCTION ? '[name].[chunkhash].js' : '[name].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'exchange-screen-ui',
                filename: 'index.hbs',
                template: './src/server/pages/index.html.ejs',
                alwaysWriteToDisk: true,
                inject: false,
                isProduction: IS_PRODUCTION
            }),
            new HtmlWebpackHarddiskPlugin({
                outputPath: path.resolve(__dirname, BUILD_PATH)
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, 'src/icons'),
                    to: path.resolve(BUILD_PATH, ASSETS_PATH)
                }
            ])
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ],
                    exclude: /node_modules/
                }
            ]
        }
    },
    IS_PRODUCTION ? WEBPACK_CONFIG_TEMPLATE_PRODUCTION : WEBPACK_CONFIG_TEMPLATE_DEVELOPMENT
);

module.exports = webpackConfig;

const { resolve } = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const { VueLoaderPlugin } = require('vue-loader'); // vue加载器

const { NODE_ENV } = process.env;

// 获取时间
const TimeFn = require('../get_time');

/**
 *  css和stylus开发、生产依赖
 *  生产分离css
 */
const cssConfig = [
    'style-loader',
    {
        loader: 'css-loader'
    },
    {
        loader: 'postcss-loader'
    }
];
const stylusConfig = [
    'style-loader',
    {
        loader: 'css-loader'
    },
    {
        loader: 'postcss-loader'
    },
    {
        loader: 'stylus-loader'
    }
];

/**
 * 判断是生产环境还是开发环境
 * @type {boolean}
 * isProd为true表示生产
 */
const isProd = NODE_ENV === 'production';

const {
    name, version, author, license
} = require('../package.json');

const banner = `@${name} v${version}
(c) 2019-2021 ${author}
Released under the ${license} License.
${TimeFn()}`;

const config = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssConfig,
                exclude: /node_modules/
            },
            {
                test: /\.styl(us)?$/,
                use: stylusConfig,
                include: [resolve(__dirname, '../src')],
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            preserveWhitespace: false // 不要留空白
                        }
                    }
                ]
                // include: [resolve(__dirname, '../src')]
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: !isProd,
                            presets: [
                                ['@babel/preset-env', { targets: '> 0.25%, not dead, ie >= 9' }]
                            ]
                        }
                    }
                ],
                exclude: {
                    and: [/node_modules/],
                    not: [/vue/, /vue-router/, /vuex/]
                }
            },
            {
                test: /\.(png|jpe?g|gif|bmp)$/,
                type: 'asset/resource',
                include: [resolve(__dirname, '../src/assets')]
            },
            {
                test: /\.svg$/,
                use: [
                    'babel-loader',
                    resolve(__dirname, '../src/loader/index.js')
                ]
            }
        ]
    },
    resolve: { // 配置路径别名
        extensions: ['.js', '.jsx', '.vue', '.styl'], // import引入文件的时候不用加后缀
        modules: [
            'node_modules',
            resolve(__dirname, '../src')
        ],
        fallback: {
            path: require.resolve('path-browserify'),
            url: require.resolve('url'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            stream: require.resolve('stream-browserify/'),
            os: require.resolve('os-browserify/browser'),
            crypto: require.resolve('crypto-browserify')
        }
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new VueLoaderPlugin(), // vue加载器

        new ProgressBarPlugin(
            {
                format: chalk.blue(`[  build :bar ${chalk.green.bold(':percent')} (:elapsed seconds) ]`),
                clear: true,
                summary: false,
                customSummary: res => {
                    process.stderr.write(chalk.yellow(` 耗时：${res} `));
                }
            }
        ),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ],
    bail: true, // 在第一个错误出现时抛出失败结果
    target: ['web', 'es5']
};

module.exports = config;

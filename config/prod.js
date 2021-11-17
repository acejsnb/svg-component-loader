const { resolve, join } = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理垃圾文件
const TerserPlugin = require('terser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = require('./base');

const config = {
    entry: {
        index: ['core-js/stable', 'regenerator-runtime/runtime', resolve(__dirname, '../src/main.js')] // 入口文件
        // index: resolve(__dirname, '../src/main.js') // 入口文件
        // index: ['@babel/polyfill', resolve(__dirname, '../src/main.js')] // 入口文件
    },
    output: {
        path: resolve(__dirname, '../production'),
        filename: 'javascript/[name].[contenthash:5].js', // [name] 是entry的key
        publicPath: './',
        assetModuleFilename: 'images/[name].[hash:5][ext][query]'
    },
    plugins: [
        // new CopyWebpackPlugin([{
        //     from: resolve(__dirname, '../node_modules/vue/dist/vue.min.js'),
        //     to: 'modules'
        // }, {
        //     from: resolve(__dirname, '../node_modules/vuex/dist/vuex.min.js'),
        //     to: 'modules'
        // }, {
        //     from: resolve(__dirname, '../node_modules/vue-router/dist/vue-router.min.js'),
        //     to: 'modules'
        // }]),
        new HtmlWebpackPlugin({
            template: join(__dirname, '../src/index.html'), // 引入模版
            favicon: join(__dirname, '../src/assets/favicon.ico'),
            filename: 'index.html',
            minify: { // 对index.html压缩
                collapseWhitespace: true, // 去掉index.html的空格
                removeAttributeQuotes: true, // 去掉引号
                removeComments: true
            },
            hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
            // ,chunks:['vendor','main'] // 在产出的html文件里面引入哪些代码块，里面的名字要跟entry里面key对应(一般用于多文件入口)
            inlineSource: '.(js|css)'
        }),
        new CleanWebpackPlugin({
            verbose: true, // 打印被删除的文件
            protectWebpackAssets: false, // 允许删除cleanOnceBeforeBuildPatterns中的文件
            cleanOnceBeforeBuildPatterns: ['**/*', resolve(__dirname, '../production')]
        }),
        new MiniCssExtractPlugin({ // 分离css
            filename: 'stylesheets/[name].[contenthash:5].css'
        })
    ],
    optimization: { // 抽离第三方插件
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 不生成LICENSE.txt
                terserOptions: {
                    toplevel: true, // 最高级别，删除无用代码
                    // ie8: true,
                    safari10: true
                }
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            // minSize: 10000, // 提高缓存利用率，这需要在http2/spdy
            // maxSize: 0, // 没有限制
            minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
            maxAsyncRequests: 5, // 最多的异步chunk数
            maxInitialRequests: 5, // 最多的同步chunks数
            // name: false,
            cacheGroups: { // 这里开始设置缓存的 chunks
                vendor: { // key 为entry中定义的 入口名称，new webpack.ProvidePlugin中的库
                    test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    // test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/, // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    enforce: true
                },
                main: {
                    test: /[\\/]src[\\/]/,
                    name: 'main',
                    enforce: true
                }
            }
        },
        runtimeChunk: { name: 'runtime' } // 为每个入口提取出webpack runtime模块
    }
};

module.exports = merge(baseConfig, config);

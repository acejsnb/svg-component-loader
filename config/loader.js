const { resolve } = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理垃圾文件
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = require('./base');

const config = {
    entry: {
        index: resolve(__dirname, '../src/loader/index.js') // 入口文件
    },
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'index.js',
        publicPath: '/',
        library: 'vuecomponent-svg-loader',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true, // 打印被删除的文件
            protectWebpackAssets: false, // 允许删除cleanOnceBeforeBuildPatterns中的文件
            cleanOnceBeforeBuildPatterns: ['**/*', resolve(__dirname, '../dist')]
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
        ]
    }
};

module.exports = merge(baseConfig, config);

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(config, {
    devServer: {
        hot: true,
        host: 'localhost',
        port: 8000,
        historyApiFallback: true,
        writeToDisk: true
    },
    devtool: 'inline-source-map',
    module: {
        rules: [],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
});

'use strict';
const debug = process.env.DEBUG === 'true';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, './src/'),
    dist: path.resolve(__dirname, './dist/')
}

module.exports = {
    watch: true,
    resolve: {
        alias: {
            Assets: path.resolve('src/static'),
            Components: path.resolve('src/components'),
            /*Controllers: path.resolve('src/controllers'),
            Events: path.resolve('src/events'),
            Models: path.resolve('src/models'),
            Modules: path.resolve('src/modules'),
            Views: path.resolve('src/views'),*/
        },
        extensions: ['.js'],
    },
    mode: debug ? 'development' : 'production',
    entry: path.resolve('./src/app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',
        filename: 'index_bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                exclude: /(node_modules)/,
                include: [
                  path.resolve(__dirname, 'src/'),
                ],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(svg|png|jpg|jpeg|woff|woff2|eot|ttf)$/,
                use: 'file-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'static', 'images'),
                    to: path.resolve(__dirname, 'dist', 'static', 'images')
                }
            ]
        }),
        new webpack.DefinePlugin({
            DEBUG: debug,
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: false,
        port: 3000,
        historyApiFallback: true,
    },
}
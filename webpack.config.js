'use strict';
const debug = process.env.DEBUG === 'true';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.resolve(__dirname, './dist'),
};

module.exports = {
    watch: true,
    resolve: {
        alias: {
            _assets: `${PATHS.src}/static`,
            _components: `${PATHS.src}/components`,
        },
        extensions: ['.js'],
    },
    mode: debug ? 'development' : 'production',
    entry: `${PATHS.src}/app.js`,
    output: {
        path: PATHS.dist,
        publicPath: './',
        filename: `index_bundle_[hash].js`,
        assetModuleFilename: 'assets/[name][ext]',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                exclude: /node_modules/,
                include: PATHS.src,
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
            },
            // {
            //     test: /\.(svg|png|jpg|jpeg|woff|woff2|eot|ttf)$/,
            //     use: 'file-loader',
            // },
            {
                test: /\.(png|svg|jpeg|jpg|gif|ico)$/i,
                exclude: /node_modules/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.html'),
            filename: 'index.html',
            favicon: `${PATHS.src}/static/images/favicon.ico`,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'static', 'images'),
                    to: path.resolve(__dirname, 'dist', 'static', 'images'),
                },
                {from: `${PATHS.src}/static/images/favicon.ico`, to: 'favicon.ico'},
            ],
        }),
    ],
    devServer: {
        static: {
            directory: PATHS.dist,
        },
        compress: false,
        port: 9000,
        historyApiFallback: true,
    },
};

// Daniel Cortez-Sanchez 6/6/24
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

const isProduction = (process.env.NODE_ENV === 'production');
const fileNamePrefix = isProduction ? '[chunkhash].' : '';

module.exports = {
    mode: !isProduction ? 'development' : 'production',
    entry: {
        calendar: './src/js/calendar.js',
        weather: './src/js/weather.js',
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: fileNamePrefix + '[name].js',
        assetModuleFilename: "assets/[name][ext]",
        clean: true,
    },
    target: 'web',
    devServer: {
        static: "./dist"
    },
    devtool: !isProduction ? 'source-map' : 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/calendar.html"),
            chunks: ["calendar", "weather"],
            inject: "body",
            filename: "calendar.html",
        }),
        new MiniCssExtractPlugin({
            filename: fileNamePrefix + "[name].css",
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            SERVER_URL: JSON.stringify(process.env.SERVER_URL),
            GMAP_KEY: JSON.stringify(process.env.GMAP_KEY),
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
};

if (isProduction) {
    module.exports.plugins.push(
        new MiniCssExtractPlugin({
            filename: fileNamePrefix + "[name].css",
        })
    );
};

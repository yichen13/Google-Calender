const webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
    entry: {
        index: __dirname + '/index.jsx',
        app: __dirname + '/app.jsx'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: [".js", ".jsx", ".css", "js/Calendar.jsx"],
    },
    module: {
        rules: [
            {
                test:/\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ]
};

module.exports = config;

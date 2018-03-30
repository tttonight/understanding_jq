const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./src/index.js",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Understanding JQ',
            template: 'index.html'
        })
    ],

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }


}
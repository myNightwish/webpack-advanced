const path = require('path');
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin')
const RemoveLogs = require('./plugins/RemoveLogs-plugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    plugins: [
        // new CopyrightWebpackPlugin({
        //     name: 'myNightwish'
        // }),
        new RemoveLogs({

        })
    ]
}
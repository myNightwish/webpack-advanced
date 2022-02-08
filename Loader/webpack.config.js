const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js/,
            use: [
                // path.resolve(__dirname, './loaders/replaceLoaders.js')
                {
                    // 这里除了字符串，还可以配置一个对象
                    loader: path.resolve(__dirname, './loaders/replaceLoaders.js'),
                    options: {
                        name: 'myNightwish'
                    }
                }
            ]
        }
        ]
    }
}
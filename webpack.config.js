const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
        // filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/, // I disabled this for streaming to other pc
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [
                                '@babel/transform-runtime', {
                                    "absoluteRuntime": false,
                                    "corejs": false,
                                    "helpers": false, // this one is enabled by defult, it breaks all imports when used with webpack https://github.com/vercel/next.js/issues/3650
                                    "regenerator": true, // This one's needed for async
                                    "version": "7.0.0-beta.0"
                                }
                            ]
                        ]
                    }
                },
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html'
        })
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devServer: {

    }
}
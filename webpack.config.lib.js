const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/glitch-text.js',
    output: {
        path: './',
        filename: './dist/glitch-text.min.js',
        library: 'GlitchText',
        libraryTarget: 'umd'
    },
    externals: ['jquery'],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.BannerPlugin('Copyright (c) 2017 Bartosz Lorek. MIT license')
    ],
    resolve: {
        alias: {
            aframe: path.resolve(__dirname, 'external/aframe/src/aframe.js')
        }
    }
}
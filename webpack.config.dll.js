const Paths = require('./paths');
const { paths, resolveRoot } = Paths;
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    resolve: {
		extensions: [".js", ".jsx"]
    },
    entry: {
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: paths.dllPath,
        filename: '[name].dll.js',
        pathinfo: true,   // 显示详细的路径信息
        library: '[name]',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                      comments: false,
                    },
                },
                extractComments: false,  // 是否将注释剥离到单独的文件中
            })
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            format: true,
            name: '[name]',
            path: resolveRoot('./static/dll/[name].manifest.json'),
            entryOnly: true,
        })
    ]
}
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function resolveRoot(p) {
    return path.resolve(process.cwd(), p);
}

const pathObj = {
    indexPath: resolveRoot('./src/index.js'),
    distPath: resolveRoot('./dist'),
    indexHtmlPath: resolveRoot('./public/index.html'),
}
console.log(process.cwd())
console.log('pathObj=', pathObj)



module.exports = {
    entry: {
        index: {
            import: pathObj.indexPath,
        },
    },
    output: {
      path: pathObj.distPath,
      filename: 'js/[name].[contenthash:16].js',
      clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
        static: pathObj.distPath,
    },
    optimization: {
        runtimeChunk: 'single',       // runtime文件共享，且只会生成一个文件实例
        moduleIds: 'deterministic',   // 为了新增文件时，缓存文件不会因为module.id变化而变化
        splitChunks: {
            cacheGroups: {
                vendor: {             // 抽离第三方库
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
        inject: true,
        template: pathObj.indexHtmlPath,
      }),
    ],
  };
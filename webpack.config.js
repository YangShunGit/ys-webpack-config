const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');

function resolveRoot(p) {
    return path.resolve(process.cwd(), p);
}

const pathObj = {
    indexPath: resolveRoot('./src/index.js'),
    distPath: resolveRoot('./dist'),
    indexHtmlPath: resolveRoot('./public/index.html'),
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const getStyleLoader = (preProcessor) => {
    const use = [ 
        isProduction 
            ? MiniCssExtractPlugin.loader 
            : "style-loader", 
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            'postcss-preset-env',
                        ],
                    ],
                },
            },
        },
    ]

    if (preProcessor) {
        use.push(preProcessor);
    }

    return use;
}

module.exports = {
    target: ['browserslist'],
    entry: {
        index: {
            import: pathObj.indexPath,
        },
    },
    output: {
      path: pathObj.distPath,
      pathinfo: isDevelopment,   // 开发模式显示详细的路径信息
      filename: 
        isProduction 
        ? 'js/[name].[contenthash:8].js' 
        : 'js/[name].bundle.js',
      clean: true,
    },
    devtool: isProduction ? false : 'cheap-module-source-map',
    devServer: {
        static: pathObj.distPath,
        hot: true,
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            // This is only used in production mode
            new TerserPlugin({
              terserOptions: {
                parse: {
                  // We want terser to parse ecma 8 code. However, we don't want it
                  // to apply any minification steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  // Disabled because of an issue with Uglify breaking seemingly valid code:
                  // https://github.com/facebook/create-react-app/issues/2376
                  // Pending further investigation:
                  // https://github.com/mishoo/UglifyJS2/issues/2011
                  comparisons: false,
                  // Disabled because of an issue with Terser breaking valid code:
                  // https://github.com/facebook/create-react-app/issues/5250
                  // Pending further investigation:
                  // https://github.com/terser-js/terser/issues/120
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                // Added for profiling in devtools
                keep_classnames: false,
                keep_fnames: false,
                output: {
                  ecma: 5,
                  comments: false,
                  // Turned on because emoji and regex is not minified properly using default
                  // https://github.com/facebook/create-react-app/issues/2488
                  ascii_only: true,
                },
              },
            }),
            // This is only used in production mode
            new CssMinimizerPlugin(),
        ],
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
                oneOf: [
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource',
                    },
                    {
                        test: /\.(js|mjs|jsx)$/i,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                            }
                        }
                    },
                    {
                        test: /\.css$/i,
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoader('less-loader')
                    },
                    {
                        exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        type: 'asset/resource',
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: pathObj.indexHtmlPath,
        }),
        isProduction && new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
        isDevelopment && new ReactRefreshWebpackPlugin(),
        new CaseSensitivePathsPlugin()
    ].filter(Boolean),
  };
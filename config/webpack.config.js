const Paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const threadLoader = require('thread-loader');
// worker池 预热
threadLoader.warmup({}, [
  'babel-loader',
]);
const path = require('path');
const fs = require('graceful-fs');


const { resolveRoot, paths } = Paths;
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// 默认入口配置
let entry = {   
    index: './src/index.js',
}

let HtmlPluginInstance = [];

let webpackConfig = {};

// 获取自定义webpack配置
const getWebpackConfigFile = () => {
    const webpackConfigPath = path.resolve(process.cwd(), './webpack.config.js');
    // 单页面配置
    if (!fs.existsSync(webpackConfigPath)) { 
        HtmlPluginInstance.push(new HtmlWebpackPlugin({
            inject: true,
            filename: 'index.html',
            template: paths.indexHtmlPath,
        }));
        return 
    }
    webpackConfig = require(webpackConfigPath)
    // 多页面配置
    // 设置自定义入口，及多页面时HtmlWebpackPlugin配置
    if (webpackConfig.entry) {
        entry = {}
        HtmlPluginInstance = []
        for(const [key, value] of Object.entries(webpackConfig.entry)){
            entry[key] = resolveRoot(value.import)
            let template = '';
            if (value.template) {
                if (fs.existsSync(value.template)) {
                    template = value.template;
                } else {
                    console.error(`${value.template}=>未找到配置的html模板`)
                }
            } else {
                // 取当前目录默认index.html作为模板
                const defaultHtml = path.dirname(value.import) + '/index.html';
                if (fs.existsSync(defaultHtml)) {
                    template = defaultHtml;
                } else {
                    console.error(`在${defaultHtml}未找到默认index.html模板`)
                }
            }
            template = resolveRoot(value.template)
            HtmlPluginInstance.push(new HtmlWebpackPlugin({
                inject: true,
                filename: key + '.html',
                chunks: [key],
                template,
            }));
        }
    } else {
        HtmlPluginInstance.push(new HtmlWebpackPlugin({
            inject: true,
            filename: 'index.html',
            template: paths.indexHtmlPath,
        }));
    }
}

getWebpackConfigFile()

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


const { name } = require(path.join(process.cwd(), './package.json'));

module.exports = {
    target: ['browserslist'],
    entry,
    output: {
      path: paths.distPath,
    //   pathinfo: isDevelopment,   // 开发模式显示详细的路径信息
      filename: 
        isProduction 
        ? 'js/[name].[contenthash:8].js' 
        : 'js/[name].bundle.js',
      clean: true,

      // 兼容微前端配置
      library: `${name}_[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_${name}`,
      globalObject: 'window'
    },
    devtool: isProduction ? false : 'cheap-module-source-map',
    devServer: {
        static: resolveRoot('./dist'),
        hot: true,
        historyApiFallback: true,   // 使用history mode时需要设置为true
        // 兼容微前端配置
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        ...webpackConfig?.devServer
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
              extractComments: false,  // 是否将注释剥离到单独的文件中
            }),
            // This is only used in production mode
            new CssMinimizerPlugin(),
        ],
        runtimeChunk: 'single',       // runtime文件共享，且只会生成一个文件实例
        removeAvailableModules: isProduction,
        removeEmptyChunks: isProduction,
        moduleIds: 'deterministic',   // 为了新增文件时，缓存文件不会因为module.id变化而变化
        splitChunks: {
            cacheGroups: {
                vendor: {             // 抽离第三方库
                    test: /[\\/]node_modules[\\/](react|react-dom|react-redux|react-router-dom|@reduxjs[\\/]toolkit)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    resolve: {
        extensions: ['.jsx', '.tsx', '.js', '.ts'],
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/i,
                        exclude: /node_modules/,
                        use: [
                            "thread-loader",
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: ['@babel/preset-env'],
                                    plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                                    cacheDirectory: true,
                                    cacheCompression: false,
                                    compact: isProduction,
                                }
                            }
                        ]
                    },
                    {
                        test: /\.css$/i,
                        use: getStyleLoader(),
                        sideEffects: true,
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoader('less-loader'),
                        sideEffects: true,
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource',
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
        ...HtmlPluginInstance,
        isProduction && new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
        // react > 16.9.0 is work
        isDevelopment && new ReactRefreshWebpackPlugin(),
        new CaseSensitivePathsPlugin(),
        new ESLintPlugin({
            // Plugin options
            extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            formatter: 'stylish',
            eslintPath: require.resolve('eslint'),
            context: paths.srcPath,
            cache: true,
            cacheLocation: path.resolve(
              paths.rootPath,
              '.cache/.eslintcache'
            ),
            // ESLint class options
            cwd: paths.rootPath,
            resolvePluginsRelativeTo: __dirname,
            baseConfig: {
              extends: [require.resolve('eslint-config-react-app')],
              rules: {
                'react/react-in-jsx-scope': 'error',
              },
            },
        }),
        webpackConfig.useWorkbox && new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
        }),
    ].filter(Boolean),
  };
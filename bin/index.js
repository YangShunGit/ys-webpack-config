#!/usr/bin/env node
const spawn = require('cross-spawn');
const path = require('path');
const webpack = path.resolve(process.cwd(), './node_modules/webpack/bin/webpack.js');
const config = path.resolve(__dirname, '../webpack.config.js');
const dllConfig = path.resolve(__dirname, '../webpack.config.dll.js');

const argv = process.argv.slice(2);
if (argv.includes('start')) {
    spawn('node', 
        [
            webpack, 
            'serve', argv.includes('--open') && '--open', 
            '--config', config, 
            '--node-env', 'development'
        ].filter(Boolean), { stdio: 'inherit' })
} else if (argv.includes('build')) {
    spawn('node', 
        [
            // '--inspect-brk',
            webpack, 
            '--config', config, 
            '--node-env', 'production'
        ], { stdio: 'inherit' })
} else if (argv.includes('dll')) {
    spawn('node', 
        [webpack, 
            '--config', dllConfig, 
            '--node-env', 'production'
        ], { stdio: 'inherit' })
}

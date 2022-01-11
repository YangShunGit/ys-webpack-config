#!/usr/bin/env node
const spawn = require('cross-spawn');
const path = require('path');
const webpack = path.resolve(process.cwd(), './node_modules/webpack/bin/webpack.js');
const config = path.resolve(__dirname, '../webpack.config.js');
spawn('node', [webpack, '--config', config, '--node-env', 'production'], { stdio: 'inherit' })
#!/usr/bin/env node
const spawn = require('cross-spawn');
const path = require('path');
const fs = require('graceful-fs');
const webpack = path.resolve(process.cwd(), './node_modules/webpack/bin/webpack.js');
const config = path.resolve(__dirname, '../config/webpack.config.js');
const dllConfig = path.resolve(__dirname, '../config/webpack.config.dll.js');

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
} else if (argv.includes('createDir')) {
    
    function create() {
        const { createDir } = require('ys-react-config');
        typeof createDir === 'function' && createDir()
        const packagePath = path.join(process.cwd(), './package.json');
        let packageJson = JSON.parse(fs.readFileSync(packagePath));
        delete packageJson.scripts.create
        delete packageJson.scripts.createDir
        fs.writeFile(packagePath, JSON.stringify(packageJson, null, 4), function(err) {
            if (err) console.log(err);
            console.log('createDir complete')
        })
    }

    try {
        fs.statSync(path.join(process.cwd(), "node_modules", 'ys-react-config')).isDirectory()
    } catch (_error) {
        const ls = spawn('npm', ['install', 'ys-react-config', '-S'], { stdio: 'inherit' })
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            create()
        });
        return;
    }
}

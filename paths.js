const path = require('path');



function resolveRoot(p = '') {
    return path.resolve(process.cwd(), p);
}

const paths = {
    rootPath: resolveRoot(),
    indexPath: resolveRoot('./src/index.js'),
    distPath: resolveRoot('./static/dist'),
    dllPath: resolveRoot('./static/dll'),
    indexHtmlPath: resolveRoot('./public/index.html'),
    srcPath: resolveRoot('./src')
}

module.exports = {
    resolveRoot,
    paths,
}
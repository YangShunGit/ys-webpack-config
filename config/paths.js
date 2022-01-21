const path = require('path');



function resolveRoot(p = '') {
    return path.resolve(process.cwd(), p);
}

const paths = {
    rootPath: resolveRoot(),
    indexPath: resolveRoot('./src/index.js'),
    distPath: resolveRoot('./dist'),
    indexHtmlPath: resolveRoot('./public/index.html'),
    srcPath: resolveRoot('./src')
}

module.exports = {
    resolveRoot,
    paths,
}
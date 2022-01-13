此webpack配置包含如下(仅适配react环境)：
webpackV5  less  typescript  eslint

Install with npm:

```bash
npm install --save-dev ys-webpack-config
```

package.json  script添加"start-yang": "yang"

run with npm

```bash
npm run start-yang
```



需在package.json中添加如下配置
```bash
    "scripts": {
        "start": "yang start",
        "start-open": "yang start --open",
        "build": "yang build"
    },
    "engines": {
        "node": ">=10.13.0"
    },
    "babel": {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript"
        ]
    },
    "browserslist": {
        "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
        ],
        "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
        ]
    }
```

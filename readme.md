此webpack配置包含如下(仅适配react环境)：    
**1.webpackV5**  
**2.less**  
**3.typescript**  
**4.eslint**   
**5.单页面or多页面**   
**6.dll文件优化，有持久化缓存所以废弃**  
**7.worker池(thread-loader)优化**  
**8.持久化缓存cache**  
**9.Tree Shaking生产模式默认启用**  
**10.支持Workbox离线应用**

## 一、Install with npm:

```bash
npm init -y
npm install --save-dev ys-webpack-config
npm install --save react react-dom
```


## 二、需在package.json中添加如下配置
```bash
    "scripts": {
        "start": "yang start",
        "start:open": "yang start --open",
        "build": "yang build",
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


## 三、自定义单页面或多页面配置（单页面可忽略以下配置）
默认单页面配置，取示例index配置，*请确保入口文件及模板存在*

1.项目根目录下新增webpack.config.js

2.暴露entry入口(多个入口则生成多页面)
```bash
module.exports = {
    entry: { 
        index: { 
            import: './src/index.js', 
            template: './public/index.html' 
        }, 
        a: { 
            import: './src/a.js', 
            template: './public/a.html' 
        } 
    }
}
```

## 四、启用离线应用Workbox
1.webpack.config.js 添加 useWorkbox配置
```bash
module.exports = {
    useWorkbox: true
}
```

2.入口js文件添加如下代码
```bash
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
```



## 四、run with npm

```bash
npm run start:open
```



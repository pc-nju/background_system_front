const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // css、js等静态资源打包时需放入static文件夹，配合后端，对这些资源忽略验证
  assetsDir: 'static',
  devServer: {
    // host: 'localhost',
    // port: 8080,
    proxy: {
      '/': {
        // target: 'http://127.0.0.1:8082', //对应自己的接口        
        target: 'http://192.168.1.4:8082', //对应自己的接口
        changeOrigin: true,
        //如果要代理 websockets，配置这个参数（后面开发ws，改为 true）
        ws: false,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      // 需要重启 IDE
      .set('styles', resolve('src/assets/styles'))
      .set('common', resolve('src/common'))
    // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
  }
}  

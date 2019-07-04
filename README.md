# background_system_front
后台管理框架的前端部分

# 注意：
master分支为权限管理系统的初始状态，以后不再改变，新的功能将添加到其他分支进行实现。若需要二次开发，可以只用master分支即可！

# 前端和后台结合运行的办法：
## 1.运行 npm run build，该命令执行成功之后，项目目录下生成一个dist文件夹
## 2.在idea的项目中，在resources文件夹下新建static文件夹
## 3.然后将dist文件夹下的内容copy到static文件夹下
## 4.然后就可以通过 http://localhost:{port}/index.html 访问前端项目

#特别注意
当需要增加新的模块时，记得在 src/utils/utils.js#formatRoutes()方法中，添加该组件的格式化方式，诸如：require(['../pages/test/' + component + '.vue'], resolve)

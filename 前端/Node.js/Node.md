# Node.js 学习笔记
--------
## 1.node.js介绍

### 1.1什么是node.js

* 提供了一个js的运行时环境(基于chorme的v8引擎)，因此没有DOM和BOM
* 提供了一些服务器级别的api操作
     - 例如文件读写
     - http服务器
     - 网络通信等
* node.js使用事件驱动，非阻塞io来达到轻量高效的目的
* node.js的npm是世界上最大的开源库之一

### 1.2node.js能做什么

* Web服务器后台
* 命令行工具(git npm等)
----------
## 2.Node中的js
- Ecmascript(没有DOM,BOM)
- 核心模块
- 第三方模块
- 用户自定义模块
### 2.1.核心模块
Node为js提供了很多服务器级别的api,这些api被封装到了一些具体的核心模块中。
比如文件操作的fs模块，http服务构建的http模块,path路径操作模块,os操作系统
信息模块等。通过require关键字来获取核心模块。例如
`var http = require('http')`
###2.2用户自定义模块
- require
   + 加载文件模块并执行里面的代码
   + 拿到被加载文件模块导出的接口对象
   + 需要注意的是在node中没有全局作用域只有模块作用域
- exports
   + 每个文件都提供了一个exports对象，默认是空对象
   + 将要被外部访问的成员挂载到exports对象中



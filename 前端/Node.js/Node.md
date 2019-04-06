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
### 2.2用户自定义模块
- require
   + 加载文件模块并执行里面的代码
   + 拿到被加载文件模块导出的接口对象
   + 需要注意的是在node中没有全局作用域只有模块作用域
- exports
   + 每个文件都提供了一个exports对象，默认是空对象
   + 将要被外部访问的成员挂载到exports对象中（这种方式可以导出多个成员，通过`exports.name`来使用）
   + 如果一个模块需要直接导出一个成员而不是通过挂载的方式可以使用`module.exports = function/var`来实现（导出单个成员）
      - 多次使用后者会覆盖前者
      - 也可以通过这种方式导出多个成员
      `module.exports={ add: function(){...},str: 'hello'}`
#### 2.2.1`exports`和`module.exports`的区别
+ 每个模块中都有一个module对象
+ module中有一个exports对象
+ 我们可以吧需要导出的成员挂载到module.exports接口对象中
+ 也就是：`module.exports.xxx=xxx`的方式
+ 但是每次都是用这种方式太麻烦了，所以node在每一个成员中添加了一个成员`exports`
+ `module.exports===exports`结果为true，也就是上面的方式完全可以使用`expoers.xxx=xxx`来代替
+ 当模块需要导出单个成员的时候必须使用`module.exports=xxx`的方式
+ 因为模块最终return的是`module.exports`而`exports`只是`module.exports`的一个引用
+ 所以你如果为`exports=xx`重新赋值，结果也不会影响到`module.exports`
+ 但是可以通过`exports=module.exports`来重现建立两者的关系
#### 2.2.2require方法加载规则
+ 优先从缓存加载
    * 也就是说如果多次require同一个文件，只会加载一次
    * 但是每次都是可以拿到接口对象
    * 保证了效率
+ 判断模块标识（模块标识即`require(xxx)`中的xxx）
    * 核心模块直接加载
    * 路径形式的模块，根据路径加载
    * 第三方模块
        - 查找文件所在目录下的node_modules/xxx/
        - 找到node_modules/xxx/package.json
        - 找到package.json中的main属性，根据main属性指定的文件加载所在目录的js文件
        - 如果main中的路径错误或者没有main，则默认查找路下的index.js
        - 如果上述目录不存在则会网上一级目录查找node_modules
        - 按照这个规则依次网上查找，直到磁盘的根目录，如果还是找不到则报错
## 3.npm
node package manager
### 3.1package.json
+ 建议每一个项目都建立一个`package.json`文件
+ 这个文件可以通过npm的`npm init`命令来初始化出来
+ 在json文件中有一个很重要的选项就是`dependencies`，里面记录了项目的依赖信息
    * 如果不小心删了依赖，可以通过json文件找回
    * 建议执行`npm install 包名`的时候加上`--save`选项可以将下载的包信息自动保存在json文件中

---------------
## 其他

### 代码风格
如果使用的是无分号风格在出现以'(','[','`'开头的时候要加分号



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

### 2.3node中的其他成员
在每个模块中，除了`require`和`exports`等模块相关的API之外，还有两个特殊的成员
+ `__dirname`可以获取当前模块所属目录的绝对路径
+ `__filename`可以获取当前模块文件的绝对路径
在文件操作中，相对路径是不可靠的，因为在node中相对路径被认为是执行node命令所在的路径
所以应该使用绝对路径来解决这个问题，但是每个人的绝对路径是不一样的
因此可以使用上面两个成员来解决问题，同时为了避免手动拼接的错误推荐使用path模块
> 补充：模块中的路径是不会受到这个影响的

---------------------
## 3.npm
node package manager包管理工具，在npmjs.com中可以搜索需要的包

### 3.1npm常用命令
+ npm init 使用向导的方式生成一个项目
    * `npm init -y`可以跳过向导快速生成
+ `npm install`
    * 一次性安装dependencies中所有的依赖，即找回删除的包
    * `npm i`
+ `npm install 包名`
    * 只下载指定的包
    * `npm i 包名`
+ `npm install --save 包名`
    * 下载并保存依赖项，保存在package.json文件的dependencies中
    * `npm i -S 包名`
+ `npm uninstall --save 包名`
    * 删除的同时也会吧依赖信息移除
    * `npm un -S 包名`
+ `npm hlep`
    * 查看帮助
+ `npm 命令 --help`
    * 查看指定命令的帮助
    * 例如可以通过`npm uninstall --help`来查看uninstall的简写

### 3.2package.json
+ 建议每一个项目都建立一个`package.json`文件
+ 这个文件可以通过npm的`npm init`命令来初始化出来
+ 在json文件中有一个很重要的选项就是`dependencies`，里面记录了项目的依赖信息
    * 如果不小心删了依赖，可以通过json文件找回
    * 建议执行`npm install 包名`的时候加上`--save`选项可以将下载的包信息自动保存在json文件中
+ 在新版本的npm中，安装包还会生成package-lock.json文件
+ 在新版本中，不需要加入--save参数就可以自动更新依赖
+ 而package-lock.json文件记录了依赖的详细信息，重新install的时候会提升速度
+ 此外package-lock.json还可以锁定依赖的版本，防止install的时候自动升级到最新版本

### 3.3解决被墙问题
通过以下命令安装国内镜像
`npm install --global cnpm`
之后使用下载的时候将npm换成cnpm就可以了
或者可以使用下面的语句配置镜像源
`npm config set registry https://registry.npm.taobao.org`
`npm config list 可以查看配置信息`
这样以后使用npm命令都是默认使用国内镜像了

---------------
## 4.Express
原生的http在某些方面不满足开发的基本需求，所以使用别人封装好的框架可以提升效率
安装`npm install --save express`

### 4.1基本路由
```
//使用get方法的基本路由
app.get('/',function(req,res){
    res.send('hello world')
    });
//post
app.post('/',function(req,res){
    res.send('hello world')
    });
```

### 4.2静态服务
```
//这种方式可以省略前面一个目录，即直接/xxx.css就可访问
app.use(express.static('./public/'))
//可以通过/public/xxx.css访问
app.use('/public/',express.static('./public/'))
//这样做可以通过/a/xx.css访问，相当于别名
app.use('/a/',express.static('./public/'))
```

### 4.3在Express中获取get数据
很简单，内置了api使用`req.query()`就可以获取数据

### 4.4在Express中获取post数据
在express中没有内置获取post请求的api，要使用第三方包`body-parser`
安装
`npm install --save body-parser`
配置
```
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

## MongoDB数据库
### 介绍
+ 非关系型数据库，储存的是key-value的键值对
+ mongoDB是长的最像关系型数据库的非关系型数据库
    * 数据库=》数据库
    * 数据表=》集合（数组）
    * 表记录=》（文档对象）
+ mongodb不需要设计表结构
+ 可以任意往里面添加数据，没有结构性一说

### 启动和关闭
+ 启动
```
//默认使用执行该命令所处盘符下的/data/db作为自己的存储目录
//所以启动之前如果没有这个目录就要新建
mongod
```
+ 停止
    * 直接关闭cmd或者ctrl+c打断

### 连接和退出
+ 连接：在cmd输入`mongo`即可连接数据库
+ 退出：在cmd输入`exit`即可连接数据库

### 基本命令（参见菜鸟教程）
+ `show dbs`查看显示所有数据库
+ `db`查看当前操作的数据库
+ `use 数据库名`切换到指定数据库（如果没有会新建）

### node连接mongodb
+ 使用第三方包`mongose`，基于mongoDB官方的mongo包在做了一次封装
+ 官网 https://mongoosejs.com/
+ mongose所有的api都支持promise

### 一些概念
+ 数据库，集合，文档
```
{
    test:{//数据库
        users:{//集合
            {name: 'zhansan', age: '18'},//文档
            {name: 'zhansan', age: '18'},
            {}
        }
    }
    ....
}
```
+ 很灵活，只需要指定往那个数据库的那个集合进行操作就可以了


------------
## 其他

### 代码风格
如果使用的是无分号风格在出现以'(','[','`'开头的时候要加分号

### 文件路径和模块标识路径
+ 文件路径可以省略./来表示相对路径
+ 如果在路径中这么写`/data/a.html`这里的/会直接默认为磁盘根目录（文件和模块中都是这样）
+ 在模块标识中./是不能省略的，不然会找不到包

### 修改完代码自动重启
可以通过第三方命令行工具，`nodemon`来帮助我们解决这个问题
```
//安装
npm install -g nodemon
//使用
node app.js->
nodemon app.js
```
只要是通过nodemon来启动的服务，工具会自动监听修改然后重启服务

### 获取异步函数返回的数据
+ 常见的异步操作有
    * setTimeout
    * fs的文件操作
    * ajax
+ 可以通过回调函数来实现,实际就是说函数也是一种数据类型
```
var fs = reqiure('fs')

exports.find(callback){
    fs.readFile(path, 'utf8', function(err,data){
            if(err){
                return callback(err)
            }
            //文件数据中有students数组
            callback(null,JSON.parse(data).students)
        })
}

//然后调用
var db=require('上面函数的文件路径')

db.find(function(err,students){
    //使用students数据
    })
```

### Promise
callback hell回调地狱
函数异步执行，无法保证顺序
```
//这样是无法保证文件的读取顺序的
var fs=require('fs')

fs.readFile('./data/a.text', 'utf8', function(err, data){
    if(err){
      throw err
    }
    console.log(data)
  })

  fs.readFile('./data/b.text', 'utf8', function(err, data){
    if(err){
      throw err
    }
    console.log(data)
  })
```
通过嵌套的方式可以解决这个问题，但是会造成回调地狱,也就是嵌套越来越深，导致代码可读性和维护性很差
```
var fs=require('fs')

fs.readFile('./data/a.text', 'utf8', function(err, data){
    if(err){
      throw err
    }
    console.log(data)
    fs.readFile('./data/b.text', 'utf8', function(err, data){
      if(err){
        throw err
      }
      console.log(data)
   })
  })
```
解决方法，在Ecmascript中增加了Promise的api，用来解决回调地域的问题。
参见Callbackhell.js


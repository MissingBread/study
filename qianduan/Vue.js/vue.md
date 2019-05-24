# Vue.js 笔记
---------------------------------
## 1.什么是vue.js
+ vue.js是目前最火的一个框架，React是目前最流行的一个框架（React出了可以开发网站， 还可以开发手机app）
+ Vue.js是前端的**主流**框架之一，和Angular.js，React.js并称前端三大主流框架
+ Vue.js是一套构建用户界面的框架，**只关注视图层**，它不仅易于上手，还便于于第三方库 进行整合
+ 主要负责MVC中View这一层

## 后端中的MVC和前端中的MVVM的区别
+ MVC是后端分层的开发概念
+ MVVM是前端视图层的概念，主要关注视图层分离，也就是说：MVVM将前端的视图层分成了三部分Model，View，ViewModel
+ MVVM一个很重要的方面是解决了controller越来越臃肿的问题，但是MVVM和MVC指的是前端还是前后端都包括呢(从web app角度来说？)

## Vue.js参考
>http://doc.vue-js.com/v2/guide/list.html

### Vue.js中的几个参数
+ 参见code/start.html
+ `v-cloak`解决插值表达式闪烁的问题，还需要在head标签中加入`<style >[v-cloak]{ display: none;}</style>`
+ `v-text`默认v-text没有闪烁问题,但是v-text会覆盖原有的内容
+ `v-html`v-html可以解析将字符串解析成html
+ `v-bind` 是vue.js提供的一个绑定属性的指令，可以被简写成 :要绑定的属性，也可以写合法的js表达式
+ `v-on:事件名` 可以给控件绑定指定的事件监听,缩写为 @
    * v-on中的事件修饰符（参见start3.html）
    * .stop阻止冒泡
    * .prevent阻止默认事件
    * .capture添加事件监听器时使用事件捕获模式
    * .self只当事件在该元素本身（比如不是子元素）触发时触发回调
    * .once事件之触发一次
    * .stop和.self的区别
        - .stop会阻止所有嵌套的事件冒泡
        - .self只会阻止当前元素

### 跑马灯效果的实现
+ 参见code/start2.html

### Vue.js中数据的双向绑定
+ 使用`v-model`可以实现表单元素和Model数据的双向绑定
+ 见start4.html

### Vue.js中使用样式
#### 使用class样式
+ 数组
`<h1 :class="['red','thin']">这是一个h1</h1>`
+ 在数组中使用三元表达式
`<h1 :class="['red','thin'，isactive?'active':'']">这是一个h1</h1>`
+ 使用嵌套对象
`<h1 :class="['red','thin'，{'active':isactive}]">这是一个h1</h1>`
+ 直接使用对象
`<h1 :class="{red: true，active: true, thin: true}">这是一个h1</h1>`

#### 使用内联样式
+ 直接在元素上使用`:style`的形式，书写样式对象
`<h1 :style="{color: 'red'，'font-size': '40px'}">这是一个h1</h1>`
+ 将样式对象定义到`data`中，并直接引用到`:style`中
    * 在data上定义样式
    ```
    data:{
        h1Style:{color: 'red'，'font-size': '40px'}
    }
    ```
    * 在元素中，通过属性绑定，将样式应用到元素中
`<h1 :style="h1Style">这是一个h1</h1>`
+ 在data中定义多个样式对应，然后引用
    * 在data上定义样式
    ```
    data:{
        h1Style:{color: 'red'，'font-size': '40px'}，
         h1Style2:{fontStyle: 'italic'}
    }
    ```
    * 在元素中，通过属性绑定，将样式应用到元素中
`<h1 :style="[h1Style,h1Style2]">这是一个h1</h1>`

## 案例
### 品牌管理案例
+ 过滤器
+ 基本的数据绑定
+ 数据搜索和删除的方法
+ 事件绑定，按键修饰符
+ 自定义指令，钩子函数参数
+ 见case1.html

## Vue实例的声明周期
+ 见start5.html
+ 什么是生命周期：从vue实例创建，运行，到销毁总是伴随着各种各样的事件，这些事件统称为生命周期
+ 生命周期钩子：就是生命周期事件的别名而已
+ 生命周期钩子=生命周期函数=生命周期事件
+ 主要生命周期函数分类：
    * 创建期间的生命周期函数：
        + beforeCreate：实例刚从内存中被创建出来，此时还没有初始化好data和methods等属性
        + created：实例已经在内存中创建好，此时data和methods也已经创建好，此时还没有开始编译模板
        + beforeMount: 此时已经完成模板编译，但是还没有挂载到页面中
        + mounted: 将模板挂载到了页面中，可以看到渲染好的页面，创建实例完成
    * 运行期间的生命周期函数：
        + beforeUpdate：状态更新之前执行此函数，此时data中的状态值是最新的，但是界面显示出来的数据
        还是旧的，因为此时还没有重新渲染DOM节点
        + updated: 实例更新完毕后调用此函数，此时data中的状态值和页面中显示的数据都已经完成跟新，界面已经被渲染好
    * 销毁期间的生命周期函数：
        + beforeDestroy: 在实例销毁之前调用，此时实例仍然是可用的
        + destroyed: 实例销毁之后调用，调用后，所有的数据，方法，指令都已经不可用了

## Vue中发起异步请求
+ 可以使用vue-resource插件来实现
+ 官网：https://github.com/pagekit/vue-resource
+ JSONP的实现原理
    + 由于浏览器的安全性限制，不允许ajax访问 协议不同，域名不同，端口号不同的数据接口，浏览器认为这种访问不安全
    + 可以通过动态创建script标签的形式，把script标签的src属性，指向数据接口的地址，因为script标签不存在跨域限制
    这种数据获取方法，叫做JSONP（注意根据JSONP的实现原理，知晓JSONP只支持GET请求）
    + 具体实现过程（参考./code/case2）
        + 先在客户端定义一个回调方法，预定义对数据的操作
        + 再把这个回调方法的名称，通过url传参的方式，提交到服务器的数据接口
        + 服务器端数据接口组织好要发送给客户端的数据，在拿着客户端传递过来的回调方法名称，拼接出一个调用这个方法的
        字符串，发送给客户端去解析执行
        + 客户端拿到服务器端返回的字符串后，当作script脚本去解析执行，这样就能拿到JSONP的数据了

## Vue中的组件
+ 什么是Vue组件
    + 组件就是为了拆分Vue实例中的代码，以不同的组件来划分不同的功能，需要什么功能调用对应的组件即可
+ 组件化和模块化的不同
    + 模块化：是从代码的逻辑的角度划分的，方便代码分层开发，保证每个模块的职能单一
    + 组件化：是从UI界面的角度划分的，前端的组件化，方便UI的重用

### 定义组件的三种方式：
+ 见start6.html
+ 使用Vue.extend和 Vue.component方法：
```
var login = Vue.entend({
    template: '<h1>登录</h1>'
    });
Vue.component('login',login);
```
+ 直接使用component方法
```
Vue.component('register',{
    template: '<h1>登录</h1>'
    });
```
+ 将模板字符串定义到script标签中
```
<script id="template" type="x-template">
    <div><a href="#">登录</a> | <a href="#">注册</a></div>
</script>
//同时需要用Vue.component来定义组件
Vue.component('account',{
    template: '#tmpl'
    });
```
> 注意：组件中的DOM结构，有且只有唯一的根元素（Root Element）来进行包裹
+ 全局组件和私有组件的创建方式

### 组件中的data和methods
    + 详见start7.html
    + data和实例中的有点不一样，组件中的data必须是一个方法，还必须返回一个对象(为什么？)

### 组件的切换
+ 详见start8.html
+ 使用v-if和v-else结合flag进行切换
+ 使用component来进行切换

### 父组件向子组件传值
+ 详见start9.html
+ 子组件中默认是无法访问父组件中data上的数据和methods中的方法
+ 父组件在引用子组件的时候，可以将数据以属性绑定的形式传递到子组件内部，供子组件使用

### 获取DOM元素和组件
+ 详见start10.html

## 路由
### 什么是路由
1. **后端路由：** 对于普通网站来说，所有链接都是url地址，所有url地址对应了服务器上的一个资源
2. **前端路由：**对于单页面的程序来说，主要通过url中的hash(#号)来实现不同页面间的切换，同时hash有一个特点，
Http请求不会包含hash相关的内容。所以单页面跳转主要用hash实现

### 路由的基本使用
见start11.html
1. 如何引入路由
2. 如何创建路由对象并绑定vm实例
3. router-view和router-link标签的使用
4. 重定向的使用
5. 通过默认的类来添加样式,路由高亮 https://router.vuejs.org/zh/api/#exact
6. 路由规则中定义参数 直接query传参或者在路由规则中匹配
8. 路由的嵌套，使用children来建立子路由(见start12.html)

### 经典视图案例
见case3.html,使用命名视图

## Webpack管理工具 
### 网页静态资源过多导致的问题
1. 网页加载速度慢，因为需要发起很多二次请求
2. 处理错综复杂的依赖关系

### 什么是Webpack
Webpack是一个前端的项目构建工具，基于node.js开发
* 基于整个项目进行构建
* 完美实现资源的合并，打包，压缩等

### 配置文件
* 配置入口和出口
```
    const path=require('path')

    module.exports={
        entry: path.join(__dirname, './src/main.js'),//入口表示webpack要打包哪个文件
        output:{//输出文件相关配置
            path: path.join(__dirname, './dist'), //指定打包后文件的输出目录
            filename: 'bundle.js' //指定输出文件名称
        }
    }
```

### 自动打包
* 安装webpack-dev-server工具
* npm i webpack-dev-server -D 在本地项目安装
* 本地安装无法直接在cmd里面使用，可以修改package.json的scripts，添加"dev": "webpack-dev-server"
然后直接npm run dev
* 在"dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"的几个参数如下
--open 直接打开浏览器 --port 3000启用端口 --contentBase src修改项目默认路径 --hot浏览器自动更新，打包补丁
>  webpack-dev-server打包后的bundle.js并没有存放到物理磁盘中，而是放在了内存中，所以在项目根目录中
找不到该文件

## 使用render来渲染组件
* 使用render渲染后return 的结果会替换页面中el指定的那个容器

## 在webpack中使用vue
* 通过`import Vue from 'vue'`导入的vue构造函数，功能不完整，只提供了runtime-only的方式，没有提供网页
那样的使用方式
* 如果要使用完整的包，可以把node_modules中Vue目录下的package.json的main属性值改为vue.js
或者是通过`import Vue from '../node_modules/vue/dist/vue.js'`
* 如果仍然只想使用`import Vue from 'vue'`，可以在webpack.config.js中添加以下代码：
```
resolve:{
    alias:{
        "vue$": "vue/dist/vue.js"
    }
}
```
* 由于在webpack中，推荐使用.vue这个组件模板文件定义组件，所以需要安装解析这种文件的loader,
`npm i vue-loader vue-template-compalier -D`
* .vue组件有三部分组成，template, script, style
    ** 在.vue文件的style中定义的样式是全局的样式，如果想私有要加scoped
> .vue文件只能通过render函数来进行渲染

## 在webpack中使用路由
* 安装使用参考vue-router官网
* 注意路由匹配的的组件，只能放到<router-view>中，而不会把vm实例使用render渲染的组件替换
* 出于模块化的构建，可以把路由单独放到一个文件中

## 其他
### Es6和node中的导入导出
* 在Es6中可以使用`import 模块名称 from '模块标识符'`   `import '表示路径'`     来导入模块
通过`export`和`export default` 向外暴露成员
    ** 使用`export default` 向外暴露成员，可以使用任意变量来接收，但是在一个模块之中，
`export default`只能向外暴露一次
    ** 在一个模块中可以同时使用export 和export default向外暴露成员
    ** 使用export向外暴露的成员，只能使用{}的形式接收，这种形式，叫做【按需导出】
    ** export可以暴露多个成员，同时如果某些成员不需要可以在import时不导入
    ** 使用export导出的成员，必须严格按照导出名字，用{}接收
    ** 如果使用export导出的成员想换一个名称，可以使用as 来起别名
* 在node中使用 `var 名称 = require('模块标识符')` 来导入模块
通过 `module.exports` 和`exports`来暴露成员


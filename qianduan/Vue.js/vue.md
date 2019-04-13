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

## 定义Vue的组件
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
+ 组件中的data和methods
    + 详见start7.html
    + data和实例中的有点不一样，组件中的data必须是一个方法，还必须返回一个对象

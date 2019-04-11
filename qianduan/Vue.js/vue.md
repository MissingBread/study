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


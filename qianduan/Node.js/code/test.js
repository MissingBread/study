//require来引入需要的包
//文件的读写

// var fs=require('fs')

// fs.writeFile('1.txt','你好啊，node.js',function(error){
// 	console.log('写入成功')
// })

// fs.readFile('1.txt',function(error,data){
// 	console.log('hehehh')
// })

//模块化通过require和export来实现
console.log('test start')
//导入模块的时候.js可以省略
var test2=require('./test2')
console.log(test2.foo)
console.log('test end')
console.log(test2.add(2,5))



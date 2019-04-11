//Promise是一个构造函数

//创建Promise容器，一旦创建会自动执行里面的代码
var p1=new Promise(function(resolve, reject){
	fs.readFile('./data/a.text', 'utf8', function(err, data){
		if (err) {
			//console.log(err)
			//把容器的pending状态改为rejected
			reject(err)
		}
		//console.log(data)
		////把容器的pending状态改为resolve
		resolve(data)
	})
})

var p2=new Promise(function(resolve, reject){
	fs.readFile('./data/b.text', 'utf8', function(err, data){
		if (err) {
			reject(err)
		}
		resolve(data)
	})
})

var p3=new Promise(function(resolve, reject){
	fs.readFile('./data/c.text', 'utf8', function(err, data){
		if (err) {
			reject(err)
		}
		resolve(data)
	})
})

//通过then获取容器中任务的状态
//其中第一个函数对应resolve(data),第二个函数对应reject(err)。
p1.then(function(data){
	console.log(data)
	//在这里可以return p2对象，然后在后面的then方法中，可以继续使用p2中的resolve和reject
	//这样就可以形成then的链式调用，解决回调地狱的问题
	return p2
},function(err){
	console.log('文件读取失败了', err)
})
.then(function(data){
	console.log(data)
	return p3
})
.then (function(data){
	console.log(data)
})


//上面是api的基本用法，还可以做一层封装
function preadFile(path){
	return p3=new Promise(function(resolve, reject){
		fs.readFile(path, 'utf8', function(err, data){
			if (err) {
				reject(err)
			}
			resolve(data)
		})
	})
}

//只需要这么调用即可
preadFile('./data/a.txt')
	.then(function(data){
		console.log(data)
		return preadFile('./data/b.txt')
	})
	.then(function(data){
		console.log(data)
	})

//引入http 模块
var http = require('http')

//创建服务器
var server = http.createServer();

//服务器处理过程
server.on('request',function(request,response){
	console.log('收到客户端请求'+request.url)
	// reponse.write('hello')
	// reponse.end()
	var url=request.url
	//字符会乱码，浏览器在不知道编码的情况下会使用
	//系统默认的编码，中文默认GBK

	//解决编码问题,响应头text/plain是简单文本，如果是html则改成text/html
	response.setHeader('Content-Type','text/plain; charset=utf-8')

	if (url==='/product') {
		var product=[
			{
				name:'苹果',
				price:999
			},
			{
				name:'菠萝',
				price:8000
			}
		]
		response.write(JSON.stringify(product))
	}else if(url==='/login'){
		response.write('login page')
	}else{
		response.write('404 not found')
	}
	//只能相应二进制或者是字符串类型

	response.end()
})

//启动服务器
server.listen(3000,function(){
	console.log('服务器已经启动')
})
var http = require ('http')
var urlModule = require('url')

var server = http.createServer()

server.on('request' , function(req , res){
    // var url = req.url

    const {pathname: url, query } = urlModule.parse(req.url, true)

    if(url === '/getscript'){
        //拼接调用字符串，返回客户端执行
        // var scriptStr = 'show()'

        //模拟数据
        var data = {
            name: 'xjj',
            age: 18
        }

        var scriptStr = `${query.callback}(${JSON.stringify(data)})`
        res.end(scriptStr)
    }else{
        res.end('404')
    }
})

server.listen('3000', function(){
    console.log('server is running')
})

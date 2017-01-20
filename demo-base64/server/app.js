var http = require('http');
var url = require("url");
var qs = require('querystring');  
var server = http.createServer(function(req,res){
 if(req.url!=="/favicon.ico"){
 	var params={};
  req.on('data',function(data){
  	console.log("服务器接收到的数据：　"+decodeURIComponent(data));
    params=qs.parse(decodeURIComponent(data));
    console.log("params =: "+params);
   
  });
  req.on("end",function(){
   console.log('客户端请求数据全部接收完毕');
  });
  }
 res.end("success");
}).listen(8088,"localhost",function(){
 console.log("App running  @ 8088");
});
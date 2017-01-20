var http = require('http');
var url = require("url");
var qs = require('querystring');  
var server = http.createServer(function(req,res){
	var rest = "success";
	if(req.url=="/base64"){
		res.setHeader("Access-Control-Allow-Origin","*");
	 	var params={};
	  	req.on('data',function(data){
		  	console.log("服务器接收到的数据：　"+decodeURIComponent(data));
		    params=qs.parse(decodeURIComponent(data));
		    console.log(params.type);

	  	});
		req.on("end",function(){
		   console.log('客户端请求数据全部接收完毕');
		   if(params.type=="encode"){
				var b = new Buffer(params.data);
				rest= b.toString('base64');
				console.log("tmp = "+rest);
	   		}else if(params.type=="decode"){
				var b = new Buffer(params.data, 'base64')
				rest= b.toString();
	   		}
	   		res.end(rest);
		});
	}else{
		console.log('Nothing to do');
	}
}).listen(8088,"localhost",function(){
 console.log("App running  @ 8088");
});
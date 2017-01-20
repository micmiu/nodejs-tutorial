var http = require('http'); // 引入http
var socket = require('socket.io') // 引入 socket.io 对象
var fs=require('fs');//用来操作文件的对象
var config = {
    'port':8088,
    'clientpage':'/ws_client.html'
};
var server = http.createServer(handler); // 用handler来处理请求
server.listen(config.port);//监听端口号
var io = socket.listen(server); //socket  监听对象
io.set('log level', 1);//
//处理请求的函数
function handler(req,res){//req 表示请求对象  res 表示响应对象
 //__dirname是应用程序根目录，下面表示把根目录中的helloworld.html文件读进来，并从响应发出去
 fs.readFile(__dirname+config.clientpage,
 function(err, data){
  if(err){
   //如果有异常，那么向客户端发送错误信息
   res.writeHead(500);
   res.write('500  : Error loading ws_page');
   return res.end();
  }
  req.setEncoding(encoding="utf8");
  res.writeHead(200);
  res.write(data, 'utf8');
  res.end();
  //发送文件中的内容 并结束响应
 });
}
//监听程序
io.sockets.on('connection', function (socket) {
  console.log("Connection " + socket.id + " accepted.");
  socket.emit('toclient','Connection successful.');
  //接收到来自客户端的名称为client的数据
  socket.on('toserver', function (data) {
    console.log("Received message: " + JSON.stringify(data) + " - from client " + socket.id);
    try{
       if(data.msg.indexOf('testspeed')>-1){
        var times = 15;
        var pkglen = 1400;
        var pkgCount = 0,percent = 0;
        var start = new Date().getTime();
        var bufData = new Buffer(pkglen);
        for(var i=0;i<pkglen;i++){
          bufData[i]='A';
        }
        while((new Date().getTime() - start) < times * 1000){
            pkgCount++;
            socket.emit('toclient',bufData);
            var currPer = Math.round((new Date().getTime() - start)* 100 / 1000 / times);
            if (currPer > percent) {
              percent = currPer;
              socket.emit('toclient','process percent = ' + percent + '%');
            }
        }
        var usetimes = Math.round((new Date().getTime() - start) / 1000);
        var speed = Math.round(pkgCount * pkglen / usetimes);
        console.log("pkg count = " + pkgCount + " times = " + usetimes);
        socket.emit('toclient','avg speed = ' + speed);

      }else if( data.msg == 'testbinary'){
        socket.emit('toclient',new Buffer(8));
      }else if( data.msg == 'calc'){
        var result = eval('('+data.expr+')');
        socket.emit('toclient',result);
      }else{
        socket.emit('toclient','I received your message:'+data.msg);//向客户端发送名字为server的数据
      }
    }catch(error){
      console.log(error);
      socket.emit('toclient','error with:'+data.msg);
    }
    
  });
  socket.on('disconnect', function(){
        console.log("Connection " + socket.id + " terminated.");
        socket.emit('toclient','Disconnect.');
    });
});


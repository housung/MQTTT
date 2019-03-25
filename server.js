var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var num = 100;
var ip = "192.168.0.32";
var port = 9001;
var topic = "test";
var value = "This is Mqtt Load Test";

var count = 1; 


var server = http.createServer(function(request,response){
	fs.readFile('HTMLPage.html',function(error,data){
	response.writeHead(200,{'Content-Type':'text/html'});
	});
}).listen(52273,function(){
	console.log('Server Running at http://127.0.0.1:52273');
});

var io = socketio.listen(server);
io.sockets.on('connection',function(socket){
		console.log('connect');
		
		socket.on('start',function(){
		console.log('start');
		io.emit('message',{ip,port,num,topic,value,count});
		});	

		socket.on('disconnect',function(){
			count++;
			console.log('disconnect');
		})

	});



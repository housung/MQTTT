 /* 
  version 0.0.1입니다. 
  우선 서버에 접속한 클라이언트를 마스터 PAGE를 통해 로드 테스트기를 
  동시에 시작하는 것이 목표입니다.
 
  #시나리오
  NODE JS 서버를 실행 시키고 각각 마스터와 클라이언트에 접속하면 
  해당 HTML을 전달해줍니다.

  마스터 PAGE엔 클라이언트가 접속한 정보와 LOAD TEST를 실행시키는
  기능을 구현돼있으므로 원하는 때에 버튼을 눌러 LOAD TEST를 실행합니다. 
  
  .....


  #생각 해둔 추가사항 
  
  - 마스터 PAGE에선 클라이언트 리스트가 뜨는데 이때 PUB과 SUB을 
  골라서 객체를 생성할 수 있는 기능 추가

  - 서버의 clients 배열에 변수 flag를 추가하여 개별/일괄 load test를 실행
  했을 때, 중첩 실행(아마 에러가 발생할 것)을 방지

  - 마스터 page는 하나만 (서버 컴퓨터 + 카운터==1)접속 할 수 있게 한다?..
 */  


//express. node js 웹프레임 워크? ... 공부 중
var app = require('express')();

//구체적으로 설명을 못달겠습니다.... 공부 중
var server = require('http').Server(app);
var io = require('socket.io')(server);

var master;
var clients = [];

//서버를 생성합니다. cmd에서 node (js의 위치) 로 실행합니다.
//port는 3000으로 열립니다. 
//위에서 http로 설정하였기때문에 http://ip:3000으로 접속해야합니다. 
server.listen(3000, function () {
          console.log('Example app listening on port 9001!');
     });

//http://ip:3000/client로 들어오는 클라이언트에게 client.html을 전달합니다
//해당 html은 클라이언트에서 실행됩니다. 
//아래 마스터 또한 마찬가지입니다.
//express 의 라우팅 기능.. 인 것 같습니다....공부 중 
app.get('/client', function (req, res) {
  res.sendFile(__dirname + '/client.html');
});

app.get('/master',function(req,res){
  res.sendFile(__dirname +'/master.html');
});

/*
 socket에 연결됬을때 발생하는 이벤트입니다.
 이를 이용하여 사용자 이벤트를 정의해서 socket 통신을 
 하는 방식인 것 같습니다.
*/

io.on('connection', function (socket) {

  socket.on('masterConnect',function(){
        master = socket.id;
  })
  /*
    어떤 클라이언트가 들어왔는지 표시하기 위한 이벤트입니다.
    notice 이벤트가 실행될 때마다 마스터 페이지엔
    클라이언트 목록이 생성됩니다.
  */
   socket.on('notice',function(){
    clients.push(socket.id);
    io.to(master).emit('noticeClient',{
      id : socket.id
    });
   });


   socket.on('run',function(){
        for(var i = 0;i<clients.length;i++){
        io.to(clients[i]).emit('start',{ 
          ip:"172.30.1.21",
          port : 9001,
          id : clients[i],
          topic : "test",
          message :"test message",

          kinds : "sub",
          instance : 10


        });
     }

   })
});

 /*
    마스터 페이지에 등록되있는 함수입니다.
    이벤트가 서버에 전달되면 로드테스트를 시작합니다.
    서버에 접속된 클라이언트에게 메시지를 보내 실행합니다.
   */

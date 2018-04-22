const webSocketServer = require('websocket').server;
const http = require('http');
const portNumber = 8899
exports.server = () =>{
  const webSocketsServerPort = portNumber;
  const server = http.createServer(function (request, response) { });
  server.listen(webSocketsServerPort, function () {
  })
  const wsServer = new webSocketServer({ httpServer: server });

  let clients = [];
  wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    connection.on('message', function (message) {
      console.log(message.utf8Data);
      //これをexportsしたい
    });
    connection.on('close', function (connection) {
      clients.splice(index, 1);
    });
  })
  setTimeout(()=>{
    console.log("send")
    clients[0].send(JSON.stringify({
      "username" : "krt6017",
      "text" : "てすとーーーkjkkkzkjjkknーー"
    }))
    },20000)

}
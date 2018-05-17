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
      console.log(message)
      const createStream = require("./stream.js").create
      createStream(message.utf8Data)
    });
    connection.on('close', function (connection) {
      clients.splice(index, 1);
    });
  })
  /*
  setTimeout(()=>{
    setInterval(()=>{
    console.log("send")
    clients[0].send(JSON.stringify({
      "username" : "@krt6017",
      "text" : "2にゃーん"
    }))
    },1000)
  },20000)
  */
}
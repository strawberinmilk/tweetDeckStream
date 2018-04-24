const stream = require('stream');
let createData = new stream();
createData.readable = true;
let writeData = new stream();
writeData.writable = true;
writeData.write = function (data) {
  console.log(data)
};
createData.pipe(writeData);

exports.create =(data)=>{
  createData.emit('data', data);
}
exports.write = writeData;

//howToUse
/*
const writeStream = require("./index.js").write
writeStream.write = (data)=>{
  console.log(data)
}

const createStream = require("./index.js").createStream
setInterval(()=>{
  createStream("にゃーん")
},1000)
*/
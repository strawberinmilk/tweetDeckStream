const puppeteer = require("./puppeteer.js").puppeteer();
const server = require("./server.js").server();

const writeStream = require("./stream.js").write
exports.deckStream = writeStream
/*
writeStream.write = (data)=>{
  console.log(data)
}
*/
exports.nyan = (()=>{
  const fs = require("fs")
  let interval = ()=>{return "にゃーん"}
  console.log(interval())
  const readable = setInterval(()=>{interval()},100);
  readable.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
  });
  
})()
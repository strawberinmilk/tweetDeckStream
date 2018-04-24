const tweetDeckStream = require("./app.js");
tweetDeckStream.write = (data)=>{
  console.log(data);
}
const tweetDeckStream = require("./index.js").deckStream;
tweetDeckStream.write = (getdata)=>{
  getdata = JSON.parse(getdata)
  console.log(getdata.data);
}
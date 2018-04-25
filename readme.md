

# tweetDeckStream  

### 使い方  

loginData.jsonを適切に設定します。  

app.jsをrequireします  

requireしたものの.writeを取得するとツイートのjsonが出力されます。

```
const tweetDeckStream = require("./app.js")
tweetDeckStream.write = (data)=>{
  console.log(data);
}
```   


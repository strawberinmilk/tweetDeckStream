

# tweetDeckStream  

### 使い方  

```
npm i  
```

loginData.jsonを適切に設定します。  

index.jsをrequireします  

requireしたものの.writeを取得するとツイートのjsonが出力されます。

```
const tweetDeckStream = require("./app.js")
tweetDeckStream.write = (data)=>{
  console.log(data);
}
```   


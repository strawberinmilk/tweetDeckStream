

# tweetDeckStream  

### 使い方  

```
npm i tweetdeckstream  
```

loginData.jsonを適切に設定します。  

npmから落とした場合はモジュール名を、githubから落とした場合はindex.jsをrequireします  

requireしたものの .write を取得するとツイートのjsonが出力されます。

```
const tweetDeckStream = require("./tweetdeckstream")/*require("index.js")*/
tweetDeckStream.write = (data)=>{
  console.log(data);
}
```   


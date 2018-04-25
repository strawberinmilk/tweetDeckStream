exports.puppeteer = () =>{
  const fs = require('fs');
  const assert = require('assert');
  const puppeteer = require('puppeteer');

  puppeteer.launch().then(async () => {
    console.log("poppeteer start...")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://tweetdeck.twitter.com/');
    if (!!await page.$(".form-legend")) {
      console.log("login...")
      let caution__json = fs.readFileSync("./loginData.json","utf8");
      caution__json = JSON.parse(caution__json);
      let caution__username = caution__json.username
      let caution__password = caution__json.password
      await page.click(".Button");
      await page.waitForNavigation();
      await page.type(".js-username-field", caution__username);
      await page.type(".js-password-field", caution__password);
      await page.click("button.submit,.medium,.js-submit input");
      await page.waitForNavigation();
      //await page.screenshot({ path: 'login_screenshot.png' });
      if (!!await page.$(".message-text")) {
        console.log("loin Failure");
        process.exit(1);
      } else {
        console.log("login sucsess");
      }
    }else{
      console.log("areadyLogin")
    }
    //await page.screenshot({ path: 'after1login.png' });    
    const innerJavaScript = await page.evaluate(() => {
      //////////////////////////////↓↓↓extention↓↓↓//////////////////////////////////////////////////////////////
      const portNumber = 8899
      /*
      node = document.getElementsByClassName("stream-item js-stream-item  is-draggable  is-actionable")[0].dataset.tweetId
      */

      const ws = new WebSocket(`ws://localhost:${portNumber}/`);
      var userName = 'ゲスト' + Math.floor(Math.random() * 100);
      ws.onerror = function (e) {
        'サーバに接続できませんでした。'
      }
      ws.onmessage = (data,a,b,c=>{
        ws.send(data);
        data = JSON.stringify(data)
        ws.send(data);
        a = JSON.stringify(a)
        ws.send(a);
        b = JSON.stringify(b)
        ws.send(b);
        c = JSON.stringify(c)
        ws.send(c);
        /*
        let userListTemp = document.getElementsByClassName("avatar compose-account-img size48");
        let userList = [];
        for(let i=0;i<userListTemp.length;i++){
          userList.push(userListTemp[i].alt.replace(/'s avatar/,"").toLowerCase())
        }
        if(userListTemp[userList.indexOf(data.username.toLowerCase())]){
          userListTemp[userList.indexOf(data.username.toLowerCase())].click();
          document.getElementsByTagName("textarea")[0].value = data.text
          document.getElementsByClassName("js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12")[0].className = "js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12"
          document.getElementsByClassName("js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12")[0].click()
        }
        */
      })
      const output = (returnJSON) => {
        ws.send(JSON.stringify({
          data: returnJSON
        }));
      }
      const deckScraping = () => {
        const tweetNodeList = document.getElementsByClassName("stream-item js-stream-item  is-draggable  is-actionable");
        for (let i = 0; i < tweetNodeList.length; i++) {
          const node = tweetNodeList[i];
          if (node.class + " ".match(/alreadySearch/)) continue;
          node.class += "alreadySearch";
          const getTweetText = () => {
            return node.getElementsByClassName("js-tweet-text tweet-text with-linebreaks")[0].innerText;
          }
          const replyTarget = () => {
            if (node.getElementsByClassName("js-other-replies-link other-replies-link")[0]) return node.getElementsByClassName("js-other-replies-link other-replies-link")[0].innerText.split(" ");
            if (getTweetText().match(/(@\w{1,15})+/gi)) return getTweetText().match(/(@\w{1,15})+/gi);
            if (node.getElementsByClassName("color-twitter-blue txt-link txt-ellipsis link-complex-target margin-b--5")[0]) return "取得はできませんが、Show this threadリンクが検出されたためリプライであることは間違いありません。"
          }

          let tweetData;
          switch (node.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("pull-left margin-hs column-type-icon icon")[0].className.replace(/pull-left margin-hs column-type-icon icon icon-/, "")) {
            case "home":
            case "notifications":
            case "list":
            case "user":
            case "activity":
            case "favorite":
            case "mention":
            case "search":
              tweetData = {
                "tweet_id": node.dataset.tweetId,
                "retweeted_by": (() => {
                  if (node.getElementsByClassName("nbfc")[0].innerText.match(/Retweeted/)) return node.getElementsByClassName("nbfc")[0].childNodes[1].innerText;
                })(),
                "reply_target": replyTarget(),
                "icon": node.getElementsByClassName("avatar")[0].src,
                "name": node.getElementsByClassName("fullname link-complex-target")[0].innerText,
                "screen_name": node.getElementsByClassName("username txt-mute")[0].innerText,
                "time_absolute": node.getElementsByClassName("tweet-timestamp js-timestamp txt-mute flex-shrink--0")[0].dateTime,
                "time_relative": node.getElementsByClassName("tweet-timestamp js-timestamp txt-mute flex-shrink--0")[0].dateTime,
                "text": getTweetText(),
                "quote": (() => {
                  if (!node.getElementsByClassName("js-quote-detail quoted-tweet nbfc br--4 padding-al margin-b--8 position-rel margin-tm is-actionable")[0]) return;
                  const quoteNode = node.getElementsByClassName("js-quote-detail quoted-tweet nbfc br--4 padding-al margin-b--8 position-rel margin-tm is-actionable")[0];
                  return {
                    "tweet_id": quoteNode.dataset.tweetId,
                    "reply_target": (() => {
                      if (quoteNode.getElementsByClassName("js-other-replies-link other-replies-link")[0]) return node.getElementsByClassName("js-other-replies-link other-replies-link")[0].innerText.split(" ");
                      if (quoteNode.getElementsByClassName("js-quoted-tweet-text with-linebreaks")[0].innerText.match(/(@\w{1,15})+/gi)) return quoteNode.getElementsByClassName("js-quoted-tweet-text with-linebreaks")[0].innerText.match(/(@\w{1,15})+/gi);
                      if (quoteNode.getElementsByClassName("margin-t--4 margin-b---3 txt-mute")[0]) return "取得はできませんが、Show this threadリンクが検出されたためリプライであることは間違いありません。"
                    })(),
                    "name": quoteNode.getElementsByClassName("fullname link-complex-target")[0].innerText,
                    "screen_name": quoteNode.getElementsByClassName("username txt-mute")[0].innerText,
                    "text": quoteNode.getElementsByClassName("js-quoted-tweet-text with-linebreaks")[0].innerText
                  }
                })()
              }
              break;
          }

          const noticeUserName = () => {
            if (node.getElementsByClassName("account-link txt-bold")[0].innerText) return node.getElementsByClassName("account-link txt-bold")[0].innerText
          }

          let notifications_data
          if (node.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("pull-left margin-hs column-type-icon icon")[0].className === "pull-left margin-hs column-type-icon icon icon-notifications") {
            if (node.getElementsByClassName("nbfc txt-line-height--20 flex-auto padding-b--2")[0]) {
              //RT,Fav
              notifications_data = {
                "status": node.getElementsByClassName("nbfc txt-line-height--20 flex-auto padding-b--2")[0].innerText.replace(noticeUserName()),
                "notice_user_id": node.getElementsByClassName("account-link txt-bold")[0].href,
                "notice_user_name": noticeUserName()
              }
              //引用
            } else if (node.getElementsByClassName("js-quote-detail quoted-tweet nbfc br--4 padding-al margin-b--8 position-rel margin-tm is-actionable")[0]) {
              notifications_data = {
                "status": "quote_tweet"
              }
            } else {
              //りぷ？
              notifications_data = {
                "status": "reply",
                "debug_messeage": "noticeカラムのRT,ファボ,引用,フォロー,リスト追加通知以外がここに分類されます。引っかかるものはリプライのみと認識して開発しています。万が一リプライ以外が反応した場合対応しますので開発者にご連絡ください。"
              }
            }
          }

          const returnJSON = {
            "column": node.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("pull-left margin-hs column-type-icon icon")[0].className.replace(/pull-left margin-hs column-type-icon icon icon-/, ""),
            "column_user": (() => {
              if (node.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0]) return node.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0].innerText;
              return;
            })(),
            "status": (() => {
              if (notifications_data) return "notifications_" + notifications_data.status
              if (tweetData.retweeted_by) return "tweet_retweet"
              if (tweetData.reply_target) return "tweet_reply"
              if (tweetData.quote) return "tweet_quote"
              return "tweet_nomal"
            })(),
            "tweet_data": tweetData,
            "notifications_data": notifications_data
          }
          output(returnJSON)
        }


        const addListNodeList = document.getElementsByClassName("activity-header flex flex-row flex-align--baseline");
        for (let i = 0; i < addListNodeList.length; i++) {
          const addListNode = addListNodeList[i];
          if (addListNode.class + " ".match(/alreadySearch/)) continue;
          addListNode.class += "alreadySearch";

          let returnJSON
          returnJSON = {
            "column": addListNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("pull-left margin-hs column-type-icon icon")[0].className.replace(/pull-left margin-hs column-type-icon icon icon-/, ""),
            "column_user": (() => {
              if (addListNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0]) return addListNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0].innerText;
              return;
            })(),
            "status": "add_list",
            "notifications_data": {
              "status": "add_list",
              "name": addListNode.getElementsByClassName("account-link txt-bold")[0].innerText,
              "screen_name": addListNode.getElementsByClassName("account-link txt-bold")[0].href.replace(/https:\/\/twitter.com\//, "@"),//ここから
              "list_name": addListNode.getElementsByClassName("account-link txt-bold")[0].nextSibling.nextSibling.innerText,
              "list_url": addListNode.getElementsByClassName("account-link txt-bold")[0].nextSibling.nextSibling.href
            }
          }
          output(returnJSON)
        }
        const followNodeList = document.getElementsByClassName("account-summary cf");
        for (let i = 0; i < followNodeList.length; i++) {
          const followNode = followNodeList[i];
          if (followNode.class + " ".match(/alreadySearch/)) continue;
          followNode.class += "alreadySearch";

          let status = (() => {
            if (followNode.parentNode.getElementsByClassName("account-link txt-bold")[0]) return "followed_you"
            return "followed_otheruser"
          })()
          let returnJSON = {
            "column": followNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("pull-left margin-hs column-type-icon icon")[0].className.replace(/pull-left margin-hs column-type-icon icon icon-/, ""),
            "column_user": (() => {
              if (followNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0]) return followNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("attribution txt-mute txt-sub-antialiased")[0].innerText;
              return;
            })(),
            "status": status,
            "notifications_data": {
              "status": status,
              "followed": {
                "name": followNode.parentNode.getElementsByClassName("account-link")[0].innerText,
                "screen_name": followNode.parentNode.getElementsByClassName("account-link")[0].href.replace(/https:\/\/twitter.com\//i, "@")
              },
              "followed_target": (() => {
                if (status === "followed_you") return "you"
                return {
                  "name": followNode.parentNode.getElementsByClassName("account-summary cf")[0].getElementsByClassName("fullname inline-block link-complex-target    position-rel txt-ellipsis")[0].innerText,
                  "screen_name": followNode.parentNode.getElementsByClassName("account-summary cf")[0].getElementsByClassName("username txt-mute")[0].innerText
                }
              })()
            }
          }
          output(returnJSON)
        }
      }

      const start = () => {
        if (location.href.match(/https\:\/\/tweetdeck\.twitter\.com\/\*?/)) {
          setTimeout(() => {
            if (document.getElementsByClassName("Button Button--primary block txt-size--18 txt-center")[0]) document.getElementsByClassName("Button Button--primary block txt-size--18 txt-center")[0].click()
            setInterval(deckScraping, 4)
          }, 2000)
        }
      }
      start()
      //////////////////////////////↑↑↑extention↑↑↑//////////////////////////////////////////////////////////////
    })//innerJavascript
  });//puppeteer
}
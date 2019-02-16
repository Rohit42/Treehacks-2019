var fetchUrl = require("fetch").fetchUrl;
fetchUrl("https://api.diffbot.com/v3/article?token=b41e836f07416e871c1df67621067174&url=https://www.theguardian.com/us-news/2019/feb/16/alexandria-ocasio-cortez-2020-endorsement-democrats", function (error, meta, body) {
    console.log(body.toString();
});
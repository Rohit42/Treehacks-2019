processArticle(article) {
    fetch("https://api.diffbot.com/v3/article?token=b41e836f07416e871c1df67621067174&url=" + this.props.domain
        , {
            method: "GET",
        }).then(response => response.json()).then(fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyDLkj36LHrQg1k5b07j3izTdjT2zSckhIE", {
            method: "POST",
            body: JSON.stringify({
                "document": {
                    "type": "PLAIN_TEXT",
                    "language": "en",
                    "content": response.objects[0].text,
                },
                "encodingType": "utf8"
            }),
            headers: {
                'Content-Type' : 'application/json'
            }}).then(response => console.log(response.json())));
}
/*global chrome*/
import React, { Component } from 'react';
import { stops } from './words';
import PropTypes from 'prop-types';
import "./content.css";


class AdditionalLinks extends Component {
    

constructor(props) {
		super(props);
		this.state = { 
			text: null,
			headlines: []
		};
	}
    processArticle(article) {
        fetch("https://api.diffbot.com/v3/article?token=b41e836f07416e871c1df67621067174&url=" + encodeURIComponent(article.url)
            , {
                method: "GET",
            }).then(response => response.json()).then(response => {
                fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyDLkj36LHrQg1k5b07j3izTdjT2zSckhIE", {
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
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(response => {
                    var se = 0
                    for (var i = 0; i < response.sentences.length; i++) {
                    se += response.sentences[i].sentiment.score;
                } response['sentiment'] = se/response.sentences.length;
                console.log(response);
            }).catch(error => { console.log('Error in GCloud', error); })
            }).catch(error => { console.log('Error in DiffBot', error); });
    }

	componentDidUpdate() {
		console.log("mount links");
		console.log(this.props.domain);
		if(this.state.text === null && this.props.domain !== null) {
			fetch("https://api.diffbot.com/v3/article?token=b41e836f07416e871c1df67621067174&url=" + this.props.domain
				, {  
				method: "GET",
			}).then(response => response.json())
			.then(response => {
				this.setState({text : JSON.stringify(response.objects[0].text)});
				return response;
			}).then(response => this.getHeadlines(response.objects[0].title));
		}

	}


	getHeadlines(query) {
		console.log(query);
		fetch("http://localhost:3000/keyword", {
			method: "POST",
			body: JSON.stringify({"text" : query}),
			headers: {
				'Content-Type' : 'application/json'
			}
		}).then(response => response.json()).then(response =>
			{
			console.log(response);
			var keywords = response.out.filter(function (x) { return stops.indexOf(x) < 0 }).join(" ");
			fetch('https://newsapi.org/v2/everything?q=' + keywords + "&language=en&apiKey=a28f02fd873b4785bb77ccdb5692d54f",{

			}).then(response => response.json()).then(response => {
				var f = response.articles.slice(0, 5);
                		f.push({ url: this.props.domain });
				console.log(response);
				for (var i = 0; i < f.length; i++) {
                        		this.processArticle(f[i]);
                    		}
                    		this.setState({
                        		headlines: response.articles.slice(0,5)
                      		});
			}).catch(error => {
				console.log('Error in obtaining headlines', error);
			})

			}
		).catch(error => {
			console.log('Failure to get keywords', error);
		});


	  }


	render() {
		console.log("rendering additional links");
		console.log(this.state.headlines);
		if(this.state.text) {
			return (
				<div>

					{this.state.headlines.map(headline => (

					<div className="card">
					  <img className="full-width" src={headline.urlToImage} alt=""/>
					  <div className="container">
					    <h4 onClick={() => {window.open(headline.url)}}> <b>{headline.title} </b> </h4> 
					    <p>{headline.content}</p> 
					  </div>
					</div>




					))}
				</div>
				);
			}
		return (
			<div>
				<img className="loading" src={chrome.runtime.getURL("./images/ajax-loader.gif")} alt="loading" height="42" width="42"/>
			</div>
		);
	}

}

export default AdditionalLinks;
	

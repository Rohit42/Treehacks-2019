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
            headlines: [],
			biases: {},
			entities: {}
		};
    }
    median(numbers) {
        var median = 0, count = numbers.length;
        numbers.sort();
    
        if (count % 2 === 0) {  // is even
            median = (numbers[count / 2 - 1] + numbers[count / 2]) / 2;
        } else { // is odd
            median = numbers[(count - 1) / 2];
        }
    
        return median;
    }
    processArticle(article) {
        fetch("https://api.diffbot.com/v3/article?token=" + process.env.DIFF_BOT + "&url=" + encodeURIComponent(article.url)
            , {
                method: "GET",
            }).then(response => response.json()).then(response => {
                fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key="+process.env.GOOGLE, {
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
                    let bia = { ...this.state.biases };
                    bia[article.url] = se / response.sentences.length;
                    this.setState({
                        biases: bia
                    });
			}).catch(error => { console.log('Error in GCloud', error); });
			console.log(response);
			fetch("https://language.googleapis.com/v1/documents:analyzeEntities?key="+process.env.GOOGLE, {
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
				console.log(response.entities);
				let entities = {};
				response.entities.sort(function(a, b) {return b.salience-a.salience})
				for (var i = 0; i < 8; i++) {
					if (response.entities[i].metadata && response.entities[i].metadata.wikipedia_url) {
						entities[response.entities[i].name] = response.entities[i].metadata.wikipedia_url;
					}
				}
				console.log(entities)
				this.setState({entities: entities});

			}
				)
			
            }).catch(error => { console.log('Error in DiffBot', error); });
    }

	componentDidUpdate() {
		console.log("mount links");
		console.log(this.props.domain);
		if(this.state.text === null && this.props.domain !== null) {
			fetch("https://api.diffbot.com/v3/article?token="+process.env.DIFF_BOT+"&url=" + this.props.domain
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
			fetch('https://newsapi.org/v2/everything?q=' + keywords + "&language=en&apiKey="+process.env.NEWS,{

            }).then(response => response.json()).then(response => {
                let url = this.props.domain;
                console.log('url', url);
                response.articles = response.articles.filter(function (x) { return x.url != url })
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
        let med = this.median(Object.values(this.state.biases));
        let heads = this.state.headlines.slice();
        let biases = {...this.state.biases}
        heads.sort(function (a, b) { return biases[a.url] - biases[b.url] });
		if(this.state.text) {
			return (
				<div>

					{Object.keys(this.state.entities).map(ent => (

					<div className="chip" onClick={() => { window.open(this.state.entities[ent]) }}>
						{ent}
					</div> ))}

					<div className="card">
					  <div className="container">
							<p><b>Current Bias:</b> {isNaN((this.state.biases[this.props.domain]-med).toFixed(2)) ? "--" : (this.state.biases[this.props.domain]-med).toFixed(2)}</p>
					  </div>
					</div>



					{heads.map(headline => (

					<div className="card">
					  <img className="full-width" src={headline.urlToImage} alt=""/>
					  <div className="container">
                                <h4 onClick={() => { window.open(headline.url) }}> <b>{headline.title} </b> </h4>
								<p>Bias: {isNaN((this.state.biases[headline.url]-med).toFixed(2)) ? "--" : (this.state.biases[headline.url]-med).toFixed(2)}</p>					    <p>{headline.content}</p> 
					  </div>
					</div>




					))}
				</div>
				);
			}
		return (
			<div>
				<img className="loading" src={chrome.runtime.getURL("./images/ajax-loader.gif")} alt="loading" height="42" width="42"/>
				<img className="logo" src={chrome.runtime.getURL("./images/logo.png")} alt="loading" height="42" width="42"/>

			</div>
		);
	}

}

export default AdditionalLinks;
	

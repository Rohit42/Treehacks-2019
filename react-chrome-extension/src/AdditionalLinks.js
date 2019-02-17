/*global chrome*/
import React, { Component } from 'react';
import { stops } from './words';
class AdditionalLinks extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            text: null,
            headlines: []
        };
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
                console.log(response);
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
        console.log(this.props.domain);
        if(this.state.text) {
            return (
                <div>
                    <h1>{this.props.domain}</h1>
                    Top Headlines:
                    {this.state.headlines.map(headline => (
                    <h4 className="link" onClick={() => {
                        window.open(headline.url)}}>{headline.title}</h4>))}
                </div>
            );
        }

        return (
            <div>
                <img src={chrome.runtime.getURL("./images/ajax-loader.gif")} alt="loading" height="42" width="42"/>
            </div>
        );
    }
}

export default AdditionalLinks;
    
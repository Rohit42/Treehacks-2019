/*global chrome*/
import React, { Component } from 'react';
class AdditionalLinks extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            text: null,
            domain: null
        };
    }

    componentDidMount() {

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const url = new URL(tabs[0].url);
            const domain = url.hostname;
            this.setState({domain: domain});
            this.getText(domain);
          });


    }

    getText(domain) {
        if(this.state.text == null && domain != null) {
            fetch(domain
            , {  
            method: "GET",
        }).then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({text : JSON.stringify(response.objects[0].text)});
        });
        }
    }

    render() {
        if(this.state.text) {
            return (
                <div>
                    <h1>{this.state.text}</h1>
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
    
/*global chrome*/
import React, { Component } from 'react';
class AdditionalLinks extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            text: null,
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
                console.log(response.objects);
                this.setState({text : JSON.stringify(response.objects[0].text)});
            });
        }

    }



    render() {
        console.log("rendering additional links");
        console.log(this.props.domain);
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
    
import React, { Component } from 'react';


class AdditionalLinks extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            url: null
        };
    }

    componentDidMount() {
        console.log("sdkljf")
        if(this.state.url == null) {
            fetch("https://api.diffbot.com/v3/article?token=b41e836f07416e871c1df67621067174&url=https://www.theguardian.com/us-news/2019/feb/16/alexandria-ocasio-cortez-2020-endorsement-democrats"
            , {  
            method: "GET",
        }).then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({url : JSON.stringify(response.objects[0].text)});
        });
        }
    }

    render() {
        if(this.state.url) {
            return (
                <div>
                    <h1>{this.state.url}</h1>
                </div>
            );
        }

        return (
            <div>
                <img src="ajax-loader.gif" alt="loading" height="42" width="42"/>
            </div>
        );
    }
}

export default AdditionalLinks;
    
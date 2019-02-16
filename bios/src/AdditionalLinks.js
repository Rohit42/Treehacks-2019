import React, { Component } from 'react';


class AdditionalLinks extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            url: null
        };
    }

    componentDidMount() {
        if(this.state.url == null) {
            console.log("here");
            this.setState({url : "something"});

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
                <h1>Failed</h1>
            </div>
        );
    }
}

export default AdditionalLinks;
    
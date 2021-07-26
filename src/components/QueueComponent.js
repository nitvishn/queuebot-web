import React, { Component } from 'react'
import { baseUrl } from '../shared/baseUrl';

const Queue = (props) => {
    console.log(props.queue);
    return (
        <h1>Done!</h1>
    );
}

class QueueComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queue: []
        };
    }

    componentDidMount() {
        console.log("QueueComponent Mounting");
        var url = new URL(baseUrl)
        var params = {
            'channel': this.props.channelId
        };
        url.search = new URLSearchParams(params).toString();
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
                error => {
                    var errormess = new Error(error.message);
                    throw errormess
                })
            .then(response => response.json())
            .then(response => this.setState({queue: response[0]}))
    }

    render() {
        console.log(this.state.queue)
        return (
            <div>
                <h1>Hi</h1>
            </div>
        )
    }
}

export default QueueComponent;
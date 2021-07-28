import React, { Component } from 'react'
import { baseUrl } from '../shared/baseUrl';
import { RenderQueue, ResponseWithTime } from './RenderQueue';

const startCountingTime = () => {
    // this.timer 
}

class QueueComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queue: [],
            isLoading: true,
            errmess: null,
        };
        this.timer = {
            fetchTimer: null,
            countTimeTimer: null
        }
        this.startCountingTime = startCountingTime.bind(this)
    }

    componentDidMount() {
        const fetchQueue = () => {
            console.log("Fetching.")
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
                .then(response => ResponseWithTime(response))
                .then(response => this.setState({ queue: response[0], isLoading: false, errmess: null }))
                .then(() => startCountingTime())
                .catch(errmess => this.setState({ queue: [], isLoading: false, errmess: errmess }))
        }

        console.log("QueueComponent Mounting");
        fetchQueue();
        this.timer.fetchTimer = setInterval(() => {
            fetchQueue();
        }, 10000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        console.log(this.state.queue)
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-9 col-md-6">
                        <RenderQueue queue={this.state.queue} isLoading={this.state.isLoading} errmess={this.state.errmess}></RenderQueue>
                    </div>
                </div>
            </div>
        )
    }
}

export default QueueComponent;
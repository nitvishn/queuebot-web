import { Button } from 'bootstrap';
import React, { Component } from 'react'
import { baseUrl } from '../shared/baseUrl';
import { RenderQueue, ResponseWithTime } from './RenderQueue';

class QueueComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueObj: [],
            isLoading: true,
            errmess: null,
        };
        this.timer = {
            fetchTimer: null,
            countTimeTimer: null
        }
    }

    popQueue(callback) {
        // const promise = new Promise((resolve, reject) => {
            
        // })
        var url = baseUrl + 'queues/' + this.props.queueId + '/pop'
        fetch(url)
            .then(() => this.fetchQueue())
            .then(() => console.log("done"))
            .then(() => callback())
            .catch(errmess => console.log(errmess));
    }

    fetchQueue() {
        console.log("Fetching.")
        var url = baseUrl + 'queues/' + this.props.queueId
        console.log(url);
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
            .then(response => {
                if(response==null){
                    var error = new Error("This queue doesn't exist.");
                    error.response = response;
                    throw error;
                }else{
                    return response;
                }
            })
            .then(response => ResponseWithTime(response))
            .then(response => this.setState({ queueObj: response, isLoading: false, error: null }))
            .catch(error => {
                console.log(error);
                this.setState({ queueObj: [], isLoading: false, error: error});
            })
    }

    componentDidMount() {
        console.log("QueueComponent Mounting");
        this.fetchQueue();
        this.timer.fetchTimer = setInterval(() => {
            this.fetchQueue();
        }, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        console.log(this.state.queueObj)
        return (
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-12">
                        <RenderQueue queueObj={this.state.queueObj} popQueue={(callback) => this.popQueue(callback)} isLoading={this.state.isLoading} error={this.state.error} fetchQueue={() => this.fetchQueue()}></RenderQueue>
                    </div>
                </div>
            </div>
        )
    }
}

export default QueueComponent;
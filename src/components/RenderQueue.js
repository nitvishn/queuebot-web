import React, { Component } from 'react'
import { Table } from 'reactstrap';
import moment from 'moment';

export const ResponseWithTime = (queueObj) => {
    if (queueObj) {
        console.log(queueObj);
        var totalTime = 0;
        var totalQuestions = 0;
        var ETA_cumulative = 0;
        for (let i = 0; i < queueObj.queue.length; i++) {
            var item = queueObj.queue[i];
            if (item.popped === 2) {
                var timeDiff = item.poppedTime2 - item.poppedTime1;
                item.answeredIn = timeDiff;
                totalTime += timeDiff;
                totalQuestions += item.numQuestions;
            } else if (item.popped === 1) {
                var timeDiff = moment().unix() - item.poppedTime1;
                item.began = timeDiff;
                if (totalQuestions > 0) {
                    ETA_cumulative = Math.max(item.numQuestions * (totalTime / totalQuestions) - timeDiff, 0);
                }
            } else {
                var ETA = null;
                if (totalQuestions > 0) {
                    console.log(totalQuestions, ETA_cumulative);
                    ETA = ETA_cumulative;
                    ETA_cumulative = ETA + item.numQuestions * (totalTime / totalQuestions)
                }
                item.ETA = ETA;
            }
        }
    }
    return queueObj;
}

export const RenderQueue = (props) => {

    const divmod = (x, y) => [Math.floor(x / y), x % y];

    const formatTime = (timeDelta) => {
        var minutes = Math.floor(timeDelta / 60);
        var seconds = timeDelta % 60;
        return minutes + "m " + Math.round(seconds) + "s"
    }

    if (props.isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    } else if (props.error) {
        return (
            <div>
                <h1>There's been an error.</h1>
                <p>{props.error.message}</p>
            </div>
        )
    }
    // else{
    //     return (<div></div>)
    // }
    var queueObj = props.queueObj;
    var counter = 0;
    var alreadyFinished = [];
    var current = [];
    var queued = [];
    queueObj.queue.map((item) => {
        counter += 1;
        if (item.popped === 2) {
            alreadyFinished.push((
                <tr key={counter} className="answered-row">
                    <th>{counter}</th>
                    <td>{item.name}</td>
                    <td>{item.numQuestions}</td>
                    <td>{item.comments}</td>
                    <td className="timeCell">Answered in {formatTime(item.answeredIn)}</td>
                </tr>
            ))
        } else if (item.popped === 1) {
            current.push((
                <tr key={counter} className="current-row">
                    <th>{counter}</th>
                    <td>{item.name}</td>
                    <td>{item.numQuestions}</td>
                    <td>{item.comments}</td>
                    <td className="timeCell">Began {formatTime(item.began)} ago</td>
                </tr>
            ))
        } else {
            queued.push((
                <tr key={counter} className="queued-row">
                    <th>{counter}</th>
                    <td>{item.name}</td>
                    <td>{item.numQuestions}</td>
                    <td>{item.comments}</td>
                    <td className="timeCell">{formatTime(item.ETA)}</td>
                </tr>
            ))
        }
    })
    return (
        <div>
            <h1 className="text-center">{queueObj.title}</h1>
            <div className="row mt-5">
                <QueueControls popQueue={(callback) => props.popQueue(callback)}></QueueControls>
                <div className="col-12 col-md-6">
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Number of Questions</th>
                                <th>Comments</th>
                                <th>ETA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queued.slice(0).reverse()}
                        </tbody>
                        <thead>
                            <tr>
                                <th colSpan="5">Currently Answering</th>
                                {/* <th>Began </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {current}
                        </tbody>

                        <thead>
                            <tr>
                                <th colSpan="5">Finished Answering</th>
                                {/* <th>Answered In</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {alreadyFinished.slice(0).reverse()}
                        </tbody>

                    </Table>
                </div>
            </div>
        </div>
    );
}

class QueueControls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            popping: false,
            password: "",
            errmess: "",
            authenticated: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ password: event.target.value });
        console.log("changed", event.target.value, this.state.password);
    }

    handleSubmit(event) {
        if (this.state.password == 'pump_2_password') {
            this.setState({ authenticated: true, errmess: "" });
        } else {
            this.setState({ authenticated: false, errmess: "Password incorrect." });
        };
        event.preventDefault();
    }

    render() {

        if (this.state.authenticated) {
            let popButton;
            if (this.state.popping) {
                popButton = <button type="button" className="btn btn-primary" disabled>Popping...</button>
            } else {
                popButton = <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({ popping: true });
                    console.log("popping...");
                    this.props.popQueue(() => {
                        console.log('finished');
                        this.setState({ popping: false });
                    });
                }}>Pop Queue</button>
            }

            return (
                <div className="text-center col-12 col-md-6">
                    <h2 className="mb-5">Queue Controls</h2>
                    <div className="text-center mt-5 mb-5">
                        {popButton}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="col-12 col-md-6">
                    <h2 className="text-center mb-5">Queue Controls</h2>
                    <p>You'll need an admin password to access queue controls.</p>
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group row">
                            <div className="col-3 my-auto">
                                <label for="password">Password: </label>
                            </div>
                            <div className="col-7">

                                <input type="password" class="form-control" id="password" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <p className="text-danger">{this.state.errmess}</p>
                        </div>
                        <button className="btn btn-primary" type="submit" value="Submit">Submit</button>
                    </form>
                </div>
            )
        }

    }
}
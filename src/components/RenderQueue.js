import React from 'react'
import { Table } from 'reactstrap';
import moment from 'moment';

export const ResponseWithTime = (response) => {
    console.log(response)
    if(response){
        var queueObj = response[0].queue
        var totalTime = 0;
        var totalQuestions = 0;
        var ETA_cumulative = 0;
        for(let i = 0; i < queueObj.queue.length; i++){
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
    return response;
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
    } else if (props.errmess) {
        return (
            <div>
                <h1>Error Encountered</h1>
                {props.errmess}
            </div>
        )
    }
    // else{
    //     return (<div></div>)
    // }
    var queueObj = props.queue.queue
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
                    <td>{item.userDisplayName}</td>
                    <td>{item.numQuestions}</td>
                    <td>{item.comments}</td>
                    <td className="timeCell">Answered in {formatTime(item.answeredIn)}</td>
                </tr>
            ))
        } else if (item.popped === 1) {
            current.push((
                <tr key={counter} className="current-row">
                    <th>{counter}</th>
                    <td>{item.userDisplayName}</td>
                    <td>{item.numQuestions}</td>
                    <td>{item.comments}</td>
                    <td className="timeCell">Began {formatTime(item.began)} ago</td>
                </tr>
            ))
        } else {
            queued.push((
                <tr key={counter} className="queued-row">
                    <th>{counter}</th>
                    <td>{item.userDisplayName}</td>
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
                        <th colspan="5">Currently Answering</th>
                        {/* <th>Began </th> */}
                    </tr>
                </thead>
                <tbody>
                    {current}
                </tbody>

                <thead>
                    <tr>
                        <th colspan="5">Finished Answering</th>
                        {/* <th>Answered In</th> */}
                    </tr>
                </thead>
                <tbody>
                    {alreadyFinished.slice(0).reverse()}
                </tbody>

            </Table>
        </div>
    );
}

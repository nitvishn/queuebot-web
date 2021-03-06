import { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchQueue } from '../redux/ActionCreators';
import QueueComponent from './QueueComponent';

const mapStateToProps = state => ({
    ...state
})

const mapDispatchToProps = (dispatch) => ({
    fetchQueue: (channelId) => dispatch(fetchQueue(channelId))
})

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        console.log("MainComponent Mounting");
        // this.props.fetchQueue("865620245950889987");
    }

    render() {
        console.log("MainComponent Rendering");
        const QueueComponentWithId = ({ match }) => {
            return (
                <QueueComponent
                    queueId={match.params.queueId}
                    queue={this.props.queue}
                />
            )
        }

        return (
            <Switch>
                <Route exact path="/"></Route>
                <Route path="/:queueId" component={QueueComponentWithId}></Route>
                <Redirect to="/"></Redirect>
            </Switch>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

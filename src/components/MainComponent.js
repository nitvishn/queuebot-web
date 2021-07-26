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
            // this.props.fetchQueue(match.params.channelId);
            return (
                <QueueComponent
                    fetchQueue={(channelId) => this.props.fetchQueue(channelId)}
                    channelId={match.params.channelId}
                    queue={this.props.queue}
                />
            )
        }

        return (
            <Switch>
                <Route path="/:channelId" component={QueueComponentWithId}></Route>
            </Switch>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

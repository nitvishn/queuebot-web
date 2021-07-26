import { combineReducers } from 'redux';
import { QueueReducer } from './queueReducer';
export default combineReducers({
    queue: QueueReducer
});
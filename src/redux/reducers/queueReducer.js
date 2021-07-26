import * as ActionTypes from '../ActionTypes'

export const QueueReducer = (state = {isLoading: true, errMess: null, queue: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_QUEUE:
            return {...state, isLoading: false, errMess:null, queue: action.payload};
        case ActionTypes.QUEUE_LOADING:
            return {...state, isLoading: true, errMess:null, queue: []};
        case ActionTypes.QUEUE_FAILED:
            return {...state, isLoading: false, errMess:action.payload, queue: []};
        default:
            return state
    }
}
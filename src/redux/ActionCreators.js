import { baseUrl } from '../shared/baseUrl';
import * as ActionTypes from './ActionTypes';

export const fetchQueue = (channelId) => (dispatch) => {
    dispatch(queueLoading());

    var url = new URL(baseUrl)
    var params = {
        'channel': channelId
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
        .then(queue => dispatch(addQueue(queue)))
        .catch(error => dispatch(queueFailed(error.message)));
}

export const addQueue = (queue) => ({
    type: ActionTypes.ADD_QUEUE,
    payload: queue
});

export const queueFailed = (errmess) => ({
    type: ActionTypes.QUEUE_FAILED,
    payload: errmess
});

export const queueLoading = () => ({
    type: ActionTypes.QUEUE_LOADING,
});
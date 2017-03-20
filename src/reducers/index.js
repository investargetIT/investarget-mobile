import { combineReducers } from 'redux'
import {
  REQUEST_CONTENT, RECEIVE_CONTENT
} from '../actions'

function contents(state = {
  isFetching: false,
  response: []
}, action) {
  switch (action.type) {
    case REQUEST_CONTENT:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_CONTENT:
      return Object.assign({}, state, {
        isFetching: false,
        response: action.contents,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  contents
})

export default rootReducer
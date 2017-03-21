import { combineReducers } from 'redux'
import {
  REQUEST_CONTENT, RECEIVE_CONTENT, RECEIVE_LOGIN_RESULT
} from '../actions'

const initialState = {
  isLogin: false,
  isFetching: false,
  projects: []
}

export default function contents(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CONTENT:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_CONTENT:
      return Object.assign({}, state, {
        isFetching: false,
        projects: action.contents,
      })
    case RECEIVE_LOGIN_RESULT:
      return Object.assign({}, state, {
        isFetching: false,
        isLogin: true,
        userInfo: {
          access_token: action.token,
          user_id: action.id
        }
      })
    default:
      return state
  }
}

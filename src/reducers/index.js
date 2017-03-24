import {
  REQUEST_CONTENT, 
  RECEIVE_CONTENT, 
  RECEIVE_USER_INFO, 
  SHOW_MSG, 
  DISMISS_ERROR_MESSAGE
} from '../actions'

const initialState = {
  isLogin: false,
  isFetching: false,
  isError: false,
  projects: []
}

export default function (state = initialState, action) {
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
    case RECEIVE_USER_INFO:
      const userInfo = Object.assign({}, action.object, {
        token: action.token
      })
      return Object.assign({}, state, {
        isFetching: false,
        isLogin: true,
        userInfo: userInfo
      })
    case SHOW_MSG:
      return Object.assign({}, state, {
        isFetching: false,
        isError: true,
        errorMsg: action.msg
      })
    case DISMISS_ERROR_MESSAGE:
      var newObj = Object.assign({}, state, {
        isError: false
      })
      delete newObj.errorMsg
      return newObj
    default:
      return state
  }
}

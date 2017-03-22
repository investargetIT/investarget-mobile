import {
  REQUEST_CONTENT, RECEIVE_CONTENT, RECEIVE_LOGIN_RESULT, RECEIVE_BUT_FAIL, DISMISS_ERROR_MESSAGE
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
    case RECEIVE_LOGIN_RESULT:
      return Object.assign({}, state, {
        isFetching: false,
        isLogin: true,
        userInfo: {
          access_token: action.token,
          user_id: action.id
        }
      })
    case RECEIVE_BUT_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        isError: true,
        errorMsg: action.message
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

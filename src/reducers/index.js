import {
  REQUEST_CONTENT, 
  RECEIVE_CONTENT, 
  RECEIVE_USER_INFO, 
  SHOW_MSG, 
  DISMISS_ERROR_MESSAGE,
  READ_USER_INFO_FROM_LOCAL_STORAGE,
  APPEND_PROJECTS,
  RECEIVE_POSTS,
  LOGOUT
} from '../actions'

const initialState = {
  isLogin: false,
  isFetching: false,
  isError: false,
  projects: [],
  posts: []
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
    case RECEIVE_POSTS: 
      return Object.assign({}, state, {
        posts: action.posts
      })
    case APPEND_PROJECTS:
      return Object.assign({}, state, {
        isFetching: false,
        projects: state.projects.concat(action.projects),
      })
    case RECEIVE_USER_INFO:
      const userInfo = Object.assign({}, action.object, {
        token: action.token
      })

      localStorage.setItem('userInfo', JSON.stringify(userInfo))

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
    case LOGOUT:
      localStorage.removeItem('userInfo')
      var newObj1 = Object.assign({}, state, {
        isLogin: false
      })
      delete newObj1.userInfo
      return newObj1
    case READ_USER_INFO_FROM_LOCAL_STORAGE:
      var currentUserInfo = localStorage.getItem('userInfo')
      var nextState = currentUserInfo ?  Object.assign({}, state, {
          isLogin: true,
          userInfo: JSON.parse(currentUserInfo)
        }) : Object.assign({}, state)
      return nextState
    default:
      return state
  }
}

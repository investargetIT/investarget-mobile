export const REQUEST_CONTENT = 'REQUEST_CONTENT'
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT'
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'
export const DISMISS_ERROR_MESSAGE = 'DISMISS_ERROR_MESSAGE'
export const READ_USER_INFO_FROM_LOCAL_STORAGE = 'READ_USER_INFO_FROM_LOCAL_STORAGE'
export const APPEND_PROJECTS = 'APPEND_PROJECTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const LOGOUT = 'LOGOUT'
export const HANDLE_ERROR = 'HANDLE_ERROR'

export function requestContents(param) {
  return {
    type: REQUEST_CONTENT,
    param
  }
}

export function receiveContents(param, json) {
  return {
    type: RECEIVE_CONTENT,
    param,
    contents: json,
    reveivedAt: Date.now()
  }
}

export function receivePosts(posts) {
  return {
    type: RECEIVE_POSTS,
    posts
  }
}

export function appendProjects(projects) {
  return {
    type: APPEND_PROJECTS,
    projects
  }
} 

export function logout() {
  return {
    type: LOGOUT
  }
}

export function receiveCurrentUserInfo(token, object) {
  return {
    type: RECEIVE_USER_INFO,
    token,
    object
  }
}

export function dismissErrMsg() {
  return {
    type: DISMISS_ERROR_MESSAGE
  }
}

export function handleError(error) {
  return {
    type: HANDLE_ERROR,
    error
  }
}

export function readUserInfoFromLocalStorage() {
  return {
    type: READ_USER_INFO_FROM_LOCAL_STORAGE
  }
}

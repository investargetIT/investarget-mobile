import fetch from 'isomorphic-fetch'
import axios from 'axios'

export const REQUEST_CONTENT = 'REQUEST_CONTENT'
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT'
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'
export const SHOW_MSG = 'SHOW_MSG'
export const DISMISS_ERROR_MESSAGE = 'DISMISS_ERROR_MESSAGE'
export const REQUEST_CURRENT_USER_INFO = 'REQUEST_CURRENT_USER_INFO'

const url = 'http://192.168.1.253:8082/api/'
// var url = 'https://api.investarget.com/api/'

function requestContents(param) {
  return {
    type: REQUEST_CONTENT,
    param
  }
}

function receiveContents(param, json) {
  return {
    type: RECEIVE_CONTENT,
    param,
    contents: json,
    reveivedAt: Date.now()
  }
}

function receiveCurrentUserInfo(token, object) {
  return {
    type: RECEIVE_USER_INFO,
    token,
    object
  }
}

function showMsg(msg) {
  return {
    type: SHOW_MSG,
    msg
  }
}

function dismissErrMsg() {
  return {
    type: DISMISS_ERROR_MESSAGE
  }
}

function handleError(error) {
  return dispatch => {
    dispatch(showMsg(error.details))
    setTimeout(function () {
      dispatch(dismissErrMsg())
    }, 1000)
  }
}

function requestCurrentUserInfo(token, id) {
  return {
    type: REQUEST_CURRENT_USER_INFO,
    token
  }
}

export function fetchContents(param) {
  return dispatch => {
    dispatch(requestContents(param))
    return fetch(url + 'services/InvestargetApi/project/GetProjects?input.revenueFrom=0&input.revenueTo=10000000000&netIncomeFrom=-2000000000&input.netIncomeTo=1000000000000&input.lang=cn')
    .then(response => response.json())
    .then(json => {
      var result = json.result.items.map(item => {
        var obj = {}
        obj['title'] = item.titleC
        obj['amount'] = item.financedAmount
        obj['country'] = item.country.countryName
        obj['imgUrl'] = item.industrys[0].imgUrl
        obj['industrys'] = item.industrys.map(i => i.industryName)
        return obj
      })
      dispatch(receiveContents(param, result))
    })
  }
}

export function login(param) {
  return dispatch => {
    dispatch(requestContents(param))
    var authToken = ''
    return axios.post(url + 'Account', param)
      .then(response => {
        if (response.data.success) {
          var id = response.data.result.id
          authToken = response.data.result.access_token
          dispatch(requestCurrentUserInfo(authToken, id))
          return axios.get(url + 'services/InvestargetApi/user/GetOne?input.lang=cn&input.id=' + id, {
            headers: {'Authorization': 'Bearer ' + authToken}
          })
        } else {
          // Login failed
          throw response.data.error
        }
      })
      .then(response => {
        if (response.data.success) {
          dispatch(receiveCurrentUserInfo(authToken, response.data.result))
        } else {
          // Get current user info failed
          throw response.data.error
        }
      })
      .catch(error => dispatch(handleError(error)))
  }
}

import fetch from 'isomorphic-fetch'
import axios from 'axios'

export const REQUEST_CONTENT = 'REQUEST_CONTENT'
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT'

// const url = 'http://192.168.1.253:8082/api/'
var url = 'https://api.investarget.com/api/'

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
    return axios.post(url + 'Account', param)
      .then(response => console.log(response))
      .catch(error => console.error(error))
  }
}

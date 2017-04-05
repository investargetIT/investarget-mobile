import axios from 'axios'

const url = 'http://192.168.1.253:8082/api/'
// const url = 'https://api.investarget.com/api/'

function ApiError(object) {
  this.name = 'ApiError'
  this.message = object.message || 'Default Message'
  this.code = object.code
  this.detail = object.details || 'Default Detail'
  this.stack = (new Error()).stack
}
ApiError.prototype = Object.create(Error.prototype)
ApiError.prototype.constructor = ApiError


function getToken() {
  var token
  var userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    token = userInfo.token
  }
  return token
}

export default {
  
  getProjects(cb, errCb, skipCount = 0) {
    axios.get(url + 'services/InvestargetApi/project/GetProjects?input.revenueFrom=0&input.revenueTo=10000000000&netIncomeFrom=-2000000000&input.netIncomeTo=1000000000000&input.lang=cn&input.skipCount=' + skipCount)
    .then(response => {
      const projects = response.data.result.items.map(item => {
        var obj = {}
        obj['id'] = item.id
        obj['title'] = item.titleC
        obj['amount'] = item.financedAmount
        obj['country'] = item.country.countryName
        obj['imgUrl'] = item.industrys[0].imgUrl
        obj['industrys'] = item.industrys.map(i => i.industryName)
        return obj
      })
      cb(projects)
    })
    .catch(error => errCb(error))
  },

  loginAndGetUserInfo(param, cb, errCb) {
    var authToken = ''
    axios.post(url + 'Account', param)
    .then(response => {
      if (response.data.success && response.data.result.access_token) {
        var id = response.data.result.id
        authToken = response.data.result.access_token
        return axios.get(url + 'services/InvestargetApi/user/GetOne?input.lang=cn&input.id=' + id, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        })
      } else if (response.data.success && !response.data.result.access_token) {
        throw new ApiError({code: 100, message: response.data.result.msg})
      } else {
        // Login failed
        throw new ApiError(response.data.error)
      }
    })
    .then(response => {
      if (response.data.success) {
        cb(authToken, response.data.result)
      } else {
        // Get current user info failed
        throw response.data.error
      }
    })
    .catch(error => errCb(error))
  },

  getPostsAndEvent(cb, errCb) {
    axios.get(url + 'services/InvestargetApi/activityPicture/GetActivitypictures')
    .then(response => {
      if (response.data.success) {
        var posts = response.data.result.map(item => {
          var obj = {}
          obj['title'] = item.title
          obj['imgUrl'] = item.url
          obj['detailUrl'] = item.detailUrl
          obj['isNews'] = item.isNews
          return obj
        })
        cb(posts)
      } else {
        throw response.data.error
      }
    })
    .catch(error => errCb(error))
  },

  getSingleProject(id, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/project/GetOne?input.lang=cn&device=phone&input.id=' + id, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    })
    .then(response => {
      if (response.data.success) {
        cb(response.data.result)
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

}
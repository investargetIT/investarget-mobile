import axios from 'axios'

const url = 'http://192.168.1.253:8082/api/'
// const url = 'https://api.investarget.com/api/'

export default {
  
  getProjects(cb, skipCount = 0) {
    axios.get(url + 'services/InvestargetApi/project/GetProjects?input.revenueFrom=0&input.revenueTo=10000000000&netIncomeFrom=-2000000000&input.netIncomeTo=1000000000000&input.lang=cn&input.skipCount=' + skipCount)
    .then(response => {
      const projects = response.data.result.items.map(item => {
        var obj = {}
        obj['title'] = item.titleC
        obj['amount'] = item.financedAmount
        obj['country'] = item.country.countryName
        obj['imgUrl'] = item.industrys[0].imgUrl
        obj['industrys'] = item.industrys.map(i => i.industryName)
        return obj
      })
      cb(projects)
    })
    .catch(e => console.error(e))
  },

  loginAndGetUserInfo(param, cb, errCb) {
    var authToken = ''
    axios.post(url + 'Account', param)
    .then(response => {
      if (response.data.success) {
        var id = response.data.result.id
        authToken = response.data.result.access_token
        return axios.get(url + 'services/InvestargetApi/user/GetOne?input.lang=cn&input.id=' + id, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        })
      } else {
        // Login failed
        throw response.data.error
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

  getPostsAndEvent(cb) {
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
    .catch(error => console.error(error))
  }

}
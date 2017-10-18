import axios from 'axios'

const url = process.env.NODE_ENV === 'development' ? 'http://192.168.1.253:8082/api/' : 'https://api.investarget.com/api/'
const baseUrl = process.env.PUBLIC_URL

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

function getCurrentUserInfo() {
  var userInfo
  var userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    userInfo = JSON.parse(userInfoStr)
  }
  return userInfo
}

function getCurrentUserId() {
  var id
  var userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    id = userInfo.id
  }
  return id
}

function getCurrentUserType() {
  var type
  var userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    type = userInfo.userType
  }
  return type
}

function getCurrentUserInfo() {
  var userInfoStr = localStorage.getItem('userInfo')
  return userInfoStr ? JSON.parse(userInfoStr) : {}
}

function getCurrentTime() {
  function fillZero(num) {
    return num < 10 ? '0' + num : '' + num;
  }
  var date = new Date();
  var y = date.getFullYear();
  var M = date.getMonth() + 1;
  var d = date.getDate();
  var H = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var timeStr = y + fillZero(M) + fillZero(d) + fillZero(H) + fillZero(m) + fillZero(s);
  return timeStr;
}

/**
 * input.ftypes 类型说明
 * 
 * 系统算法推荐 = 0,       推荐给自己的，其他几种都显示投资人的
 * 合伙人推荐 = 1,
 * 后台人员推荐 = 2,       推荐给自己的，其他几种都显示投资人的
 * 主动收藏 = 3,
 * 有兴趣 = 4
 */
function getFavoriteProjectIds(param, cb, errCb) {
  return new Promise((resolve, reject) => {
    axios.get(
      url + 'services/InvestargetApi/project/GetFavoriteProjects',
      { 
        params: Object.assign({ 'input.lang': 'cn' }, param),
        headers: { 'Authorization': 'Bearer ' + getToken() }
      }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      const idArr = response.data.result.items.map(item => item.projectId)
      if (cb) cb(idArr)
      resolve(idArr)
    })
    .catch(error => {
      if (errCb) errCb(error)
      reject(error)
    })
  })
}

function simplyGet(uri, cb, errCb) {
  return new Promise((resolve, reject) => {
    axios.get(
      url + uri,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      const data = response.data.result
      if (cb) cb(data)
      resolve(data)
    })
    .catch(error => {
      if (errCb) errCb(error)
      reject(error)
    })
  })
}

function simplyPut(uri, param, cb, errCb) {
  return new Promise((resolve, reject) => {
    axios.put(
      url + uri,
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      const data = response.data.result
      if (cb) cb(data)
      resolve(data)
    })
    .catch(error => {
      if (errCb) errCb(error)
      reject(error)
    })
  })
}

function simplyPost(uri, param, cb, errCb) {
  return new Promise((resolve, reject) => {
    axios.post(
      url + uri,
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      const data = response.data.result
      if (cb) cb(data)
      resolve(data)
    })
    .catch(error => {
      if (errCb) errCb(error)
      reject(error)
    })
  })
}

function upload(uri, data) {
  return new Promise((resolve, reject) => {
    axios.post(
      url + uri,
      data,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
      .then(response => {
	if (!response.data.success) {
          throw new ApiError(response.data.error)
        }
      const data = response.data.result
      resolve(data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

function getPublicAndNotMarketPlaceProjects(params, skipCount, maxResultCount) {
  return simplyGet('services/InvestargetApi/project/GetProjects?input.bStatus=4&input.isMarketPlace=false&input.revenueFrom=0&input.revenueTo=100000000000&input.netIncomeFrom=-100000000000&input.netIncomeTo=100000000000&input.lang=cn' + params + '&input.skipCount=' + skipCount + '&input.maxResultCount=' + maxResultCount)
}

function getPublicAndMarketPlaceProjects(params, skipCount, maxResultCount) {
  return simplyGet('services/InvestargetApi/project/GetProjects?input.bStatus=4&input.isMarketPlace=true&input.revenueFrom=0&input.revenueTo=100000000000&input.netIncomeFrom=-100000000000&input.netIncomeTo=100000000000&input.lang=cn' + params + '&input.skipCount=' + skipCount + '&input.maxResultCount=' + maxResultCount)
}

function getClosedAndNotMarketPlaceProjects(params, skipCount, maxResultCount) {
  return simplyGet('services/InvestargetApi/project/GetProjects?input.bStatus=8&input.isMarketPlace=false&input.revenueFrom=0&input.revenueTo=100000000000&input.netIncomeFrom=-2000000000&input.netIncomeTo=1000000000000&input.lang=cn' + params + '&input.skipCount=' + skipCount + '&input.maxResultCount=' + maxResultCount)
}

function getClosedAndMarketPlaceProjects(params, skipCount, maxResultCount) {
  return simplyGet('services/InvestargetApi/project/GetProjects?input.bStatus=8&input.isMarketPlace=true&input.revenueFrom=0&input.revenueTo=100000000000&netIncomeFrom=-100000000000&input.netIncomeTo=100000000000&input.lang=cn' + params + '&input.skipCount=' + skipCount + '&input.maxResultCount=' + maxResultCount)
}

const getProjectsArray = [
  getPublicAndNotMarketPlaceProjects,
  getPublicAndMarketPlaceProjects,
  getClosedAndNotMarketPlaceProjects,
  getClosedAndMarketPlaceProjects,
]

function convertIntToArray(start, length) {
  const array = []
  for (var i = start; i < (start + length); i++) {
    array.push(i)
  }
  return array
}

function intersectArray(array1, array2) {
  const result = []
  array1.forEach(item => {
    if (array2.includes(item)) {
      result.push(item)
    }
  })
  return result
}

export default {
  baseUrl,
  getCurrentUserId,
  getCurrentUserType,
  getCurrentUserInfo,
  
  getProjects(params, cb, errCb, skipCount = 0) {
    const count = []
    let newArray = []
    getPublicAndNotMarketPlaceProjects(params, 0, 1)
      .then(result => {
        count.push(result.totalCount)
        return getPublicAndMarketPlaceProjects(params, 0, 1)
      })
      .then(result => {
        count.push(result.totalCount)
        return getClosedAndNotMarketPlaceProjects(params, 0, 1)
      })
      .then(result => {
        count.push(result.totalCount)
        return getClosedAndMarketPlaceProjects(params, 0, 1)
      })
      .then(result => {
        count.push(result.totalCount)
        newArray = count.reduce((acc, val) => {
          var startIndex = 0
          if (acc.length > 0) {
            for (var a = acc.length -1; a >=0; a--) {
              var startArr = acc[a]
              if (startArr.length > 0) {
                startIndex = startArr[startArr.length -1]
                break
              }
            }
          }
          acc.push(convertIntToArray(startIndex+1, val))
          return acc
        }, [])
        const intersect = newArray.map(item => intersectArray(item, convertIntToArray(skipCount + 1, 10)))
        const requestArr = []
        intersect.forEach((item, index) => {
          if(item.length > 0) {
            requestArr.push(getProjectsArray[index](params, item[0]-newArray[index][0], item.length))
          }
        })
        return Promise.all(requestArr)
      })
      .then(result => {
        const projects = result.map(item => item.items).reduce((acc, val) => acc.concat(val), []).map(item => {
          var obj = {}
          obj['id'] = item.id
          obj['title'] = item.titleC
          obj['amount'] = item.financedAmount_USD
          obj['country'] = item.country.countryName
          obj['imgUrl'] = item.industrys[0].imgUrl
          obj['industrys'] = item.industrys.map(i => i.industryName)
          obj['isMarketPlace'] = item.isMarketPlace
          obj['amount_cny'] = item.financedAmount
          return obj
        })
        cb(projects, newArray)
      })
      .catch(error => errCb(error))
  },

  getMoreProjects(dataStructure, params, cb, errCb, skipCount = 0) {
    const intersect = dataStructure.map(item => intersectArray(item, convertIntToArray(skipCount + 1, 10)))
    const requestArr = []
    intersect.forEach((item, index) => {
      if(item.length > 0) {
        requestArr.push(getProjectsArray[index](params, item[0] - dataStructure[index][0], item.length))
      }
    })
    if (requestArr.length === 0) {
      requestArr.push(getClosedAndMarketPlaceProjects(params, 10000, 10))
    }
    Promise.all(requestArr)
      .then(result => {
        const projects = result.map(item => item.items).reduce((acc, val) => acc.concat(val), []).map(item => {
          var obj = {}
          obj['id'] = item.id
          obj['title'] = item.titleC
          obj['amount'] = item.financedAmount_USD
          obj['country'] = item.country.countryName
          obj['imgUrl'] = item.industrys[0].imgUrl
          obj['industrys'] = item.industrys.map(i => i.industryName)
          obj['isMarketPlace'] = item.isMarketPlace
          obj['amount_cny'] = item.financedAmount
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
        throw new ApiError({
          code: 120, 
          message: response.data.error.message, 
          details: response.data.error.detail
        })
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

  getSingleProject(id, cb, errCb, token) {
    return new Promise((resolve, reject) => {
      axios.get(url + 'services/InvestargetApi/project/GetOne?input.lang=cn&device=phone&input.id=' + id, {
        headers: { 'Authorization': 'Bearer ' + (token || getToken()) }
      })
      .then(response => {
        if (response.data.success) {
          if (cb) cb(response.data.result)
          resolve(response.data.result)
        } else {
          throw new ApiError(response.data.error)
        }
      })
      .catch(error => {
        if (errCb) errCb(error)
        reject(error)
      })
    })
  },

  sendVerificationCode(mobile, cb, errCb) {
    var time = getCurrentTime();
    var apiToken = md5(mobile + time);
    const param = { rec_num: mobile, apiToken: apiToken, timestamp: time }
    axios.post(url + 'services/InvestargetApi/smsService/SendVerificationCode', param)
    .then(response => {
      if (response.data.success) {
        cb(response.data.result.token)
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  checkVerificationCode(param, cb, errCb) {
    axios.post(url + 'services/InvestargetApi/smsService/CheckVerificationCode', param)
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError({
          code: 110, 
          message: response.data.error.message
        })
      }
    })
    .catch(error => errCb(error))
  },

  getContinentsAndCountries(cb, errCb) {

    var continents = []

    axios.get(url + 'services/InvestargetApi/location/GetContinents?input.lang=cn')
    .then(response => {

      if (response.data.success) {
        continents = response.data.result
        const all = continents.map(
          item => axios.get(url + 'services/InvestargetApi/location/GetCountryies?input.lang=cn&input.continentId=' + item.id)
        )
        return Promise.all(all)
      } else {
        throw new ApiError(response.data.error)
      }

    })
    .then(values => {
      
      const countries = values.map(item => {
        if (item.data.success) {
          return {
            continentId: item.data.result[0].continentId,
            result: item.data.result
          }
        } else {
          throw new ApiError(item.data.error)
        }
      })

      const continentsAndCountries = continents.map(item => {
        item['countries'] = countries.find(country => country.continentId === item.id).result
        return item
      })

      cb(continentsAndCountries)
    })
    .catch(error => errCb(error))
  },

  getIndustries(cb, errCb) {

    var parentIndustries = []

    axios.get(url + 'services/InvestargetApi/industry/GetIndustries?input.industryType=P&input.lang=cn')
    .then(response => {

      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }

      parentIndustries = response.data.result
      const all = parentIndustries.map(
        item => axios.get(url + 'services/InvestargetApi/industry/GetIndustries?input.industryType=S&input.lang=cn&input.pid=' + item.id)
      )

      return Promise.all(all)

    })
    .then(values => {

      const subIndustries = values.map(item => {
        if (!item.data.success) {
          throw new ApiError(item.data.error)
        }
        return {
          pIndustryId: item.data.result[0].pIndustryId,
          result: item.data.result
        }
      })

      const industries = parentIndustries.map(item => {
        item['subIndustries'] = subIndustries.find(
          subIndustry => subIndustry.pIndustryId === item.id
        ).result
        return item
      })

      cb(industries)

    })
    .catch(error => errCb(error))
  },

  getTags(cb, errCb) {
    axios.get(url + 'services/InvestargetApi/tag/GetTags?input.lang=cn')
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      cb(response.data.result)
    })
    .catch(error => errCb(error))
  },

  getTitles(cb, errCb) {
    axios.get(url + 'services/InvestargetApi/title/GetTitles?input.lang=cn')
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      cb(response.data.result)
    })
    .catch(error => errCb(error))
  },

  retrievePassword(param, cb, errCb) {
    axios.post(url + '/services/InvestargetApi/user/RetrievePassword', param)
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  createUser(param, cb, errCb) {
    axios.post(url + 'services/InvestargetApi/user/CreateUser', param)
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  checkMobileOrEmailExist(account, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/user/CheckMobileOrEmailExist?account=' + account)
    .then(response => {
      if (response.data.success) {
        cb(response.data.result)
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  getSingleOrganization(id, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/organization/GetOne?id=' + id, {
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

  getAllTimeLines(param, cb, errCb) {
    var userId = getCurrentUserId()
    var userType = getCurrentUserType()
    param = Object.assign({
      'input.lang': 'cn',
      'input.isClose': false,
      'input.maxResultCount': 10,
      'input.skipCount': 0,
    }, param)
    if (userType == 1) {
      param['input.investorId'] = userId
    } else if (userType == 2) {
      param['input.supplierId'] = userId
    } else if (userType == 3) {
      param['input.transactionId'] = userId
    }
    axios.get(url + 'services/InvestargetApi/projectTimeLine/GetAllLines', {
      params: param,
      headers: {'Authorization': 'Bearer ' + getToken() }
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

  getUserBasic(id, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/user/GetUserBasic', {
      params: {
        'input.lang': 'cn',
        'input.id': id
      },
      headers: {'Authorization': 'Bearer ' + getToken() }
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

  getTimeLine(id, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/projectTimeLine/GetTimeLine', {
      params: { 'input.timeLineId': id },
      headers: {'Authorization': 'Bearer ' + getToken() }
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

  getTimeLineRemarks(id, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/projectTimeLine/GetUserRemarks?timeLineId=' + id, {
      headers: {'Authorization': 'Bearer ' + getToken() }
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

  createTimeLineRemark(param, cb, errCb) {
    axios.post(url + 'services/InvestargetApi/projectTimeLine/CreateTimeLineRemark',
      param,
      { headers: {'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  modifyTimeLineRemark(id, param, cb, errCb) {
    axios.put(url + 'services/InvestargetApi/projectTimeLine/ModifTimeLineRemark?id=' + id,
      param,
      { headers: {'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  deleteTimeLineRemark(id, cb, errCb) {
    axios.delete(url + 'services/InvestargetApi/projectTimeLine/deleteTimeLineRemark?id=' + id, {
      headers: {'Authorization': 'Bearer ' + getToken() }
    })
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  getUsers(cb, errCb, skipCount=0, maxResultCount=15) {
    return simplyGet('services/InvestargetApi/user/GetUserCommon?input.lang=cn&input.maxResultCount=' + maxResultCount + '&input.userId=' + getCurrentUserId() + '&input.skipCount=' + skipCount, cb, errCb)
  },

  getUserMessages(cb, errCb) {
    axios.get(url + 'services/InvestargetApi/userMessage/GetUserMessages?input.userId=' + getCurrentUserId(), {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    })
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      cb(response.data.result)
    })
    .catch(error => errCb(error))
  },

  modifyUser(param, cb, errCb, userId = getCurrentUserId()) {
    axios.put(url + 'services/InvestargetApi/user/ModifyUser?id=' + userId, param, {
      headers: {'Authorization': 'Bearer ' + getToken() }
    })
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      }
      cb()
    })
    .catch(error => errCb(error))
  },

  modifyPassword(old, newP, cb, errCb) {
  
    const param = {
      userId: getCurrentUserId(),
      oldPassword: old,
      newPassword: newP
    }

    axios.post(
      url + 'services/InvestargetApi/user/ModifyPassword',
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError({code: 200})
      }
    })
    .catch(error => errCb(error))
  },

  changeTimeLine(param, cb, errCb) {
    axios.post(url + 'services/InvestargetApi/projectTimeLine/ChangeTimeLine',
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (response.data.success) {
        cb()
      } else {
        throw new ApiError(response.data.error)
      }
    })
    .catch(error => errCb(error))
  },

  projectCancelFavorite(param, cb, errCb) {
    axios.post(
      url + 'services/InvestargetApi/project/ProjectCancelFavorite',
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      } else {
        cb()
      }
    })
    .catch(error => errCb(error))
  },

  getFavoriteProjectIds,

  getFavoriteProjects(param, cb, errCb) {
    param = Object.assign({ 'input.lang': 'cn' }, param)
    getFavoriteProjectIds(param)
    .then(ids => {
      const all = ids.map(id => {
        return new Promise((resolve, reject) => {
          this.getSingleProject(
            id,
            item => {
              var obj = {}
              obj['id'] = item.id
              obj['title'] = item.titleC
              obj['amount'] = item.financedAmount
              obj['country'] = item.country.countryName
              obj['imgUrl'] = item.industrys[0].imgUrl
              obj['industrys'] = item.industrys.map(i => i.industryName)
              resolve(obj)
            },
            error => reject(error)
          )
        })
      })
      return Promise.all(all)
    })
    .then(projects => cb(projects))
    .catch(error => errCb(error))
  },

  favoriteProject(param, cb, errCb) {
    axios.post(
      url + 'services/InvestargetApi/project/ProjectFavorite',
      param,
      { headers: { 'Authorization': 'Bearer ' + getToken() } }
    )
    .then(response => {
      if (!response.data.success) {
        throw new ApiError(response.data.error)
      } else {
        cb()
      }
    })
    .catch(error => errCb(error))
  },

  getLinesBasic(projectId, cb, errCb) {
    axios.get(url + 'services/InvestargetApi/projectTimeLine/GetLinesBasic?input.lang=cn&input.maxResultCount=100&input.skipCount=0&input.projectId=' + projectId, {
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

  getUserRemarks(timeLineId, cb, errCb) {
    return simplyGet('services/InvestargetApi/projectTimeLine/GetUserRemarks?timeLineId=' + timeLineId, cb, errCb)
  },

  uploadUserAvatar(formData, cb, errCb, key) {

    var uri
    if (key) {
      uri = 'services/InvestargetApi/qiniuUploadService/Coverupload?bucket=image&key=' + key
    } else {
      uri = 'services/InvestargetApi/qiniuUploadService/Upload?bucket=image'
    }

    var resKey, resUrl
    upload(uri, formData)
      .then(data => {
	resKey = data.key
	resUrl = data.url
	var userInfo = getCurrentUserInfo()
	const param = Object.assign({}, userInfo, {
	        orgId: userInfo.org ? userInfo.org.id : null,
	        orgAreaId: userInfo.orgArea ? userInfo.orgArea.id : null,
	  titleId: userInfo.title ? userInfo.title.id : null,
	  photoBucket: 'image',
	  cardBucket: 'image'
	      })

	param[formData.get('key')] = data.key
      return simplyPut('services/InvestargetApi/user/ModifyUser?id=' + getCurrentUserId(), param)
    })
      .then(data => {
	cb(resKey, resUrl)
      })
    .catch(error => errCb(error))
  },

  getNotificationDetail(id, cb, errCb) {
    return simplyGet('services/InvestargetApi/userMessage/GetContent?id=' + id, cb, errCb)
  },

  readMessage(id, cb, errCb) {
    return simplyPost('services/InvestargetApi/userMessage/ReadMessage', { messageIds: [id] }, cb, errCb)
  },

  getPdfFileUrl(id, cb, errCb) {
    this.getSingleProject(id)
    .then(detail => simplyGet('services/InvestargetApi/qiniuUploadService/CreateQiNiuUrl?bucket=file&key=' + detail.projectAttachments[0].key))
    .then(url => cb(url))
    .catch(error => errCb(error))
  },

  checkUserExist(account, cb, errCb) {
    return simplyGet('services/InvestargetApi/user/CheckMobileOrEmailExist?account=' + account, cb, errCb)
  },

  uploadImage(formData, key) {
    const base = 'services/InvestargetApi/qiniuUploadService/'
    const extend = key ? 'Coverupload?bucket=image&key=' + key : 'Upload?bucket=image'
    return upload(base + extend, formData)
  },

  updateUser(userId, param, cb, errCb) {
    return simplyPut('services/InvestargetApi/user/ModifyUser?id=' + userId, param, cb, errCb)
  },

  addUser(param, cb, errCb) {
    return simplyPost('services/InvestargetApi/user/CreateUser', param, cb, errCb)
  },

  addUserCommonTransaction(userId, cb, errCb) {
    return simplyPost(
      'services/InvestargetApi/user/AddUserCommonTransaction',
      { 'userId': userId, 'transactionId': getCurrentUserId() },
      cb,
      errCb
    )
  },

  checkUserCommonTransaction(investorId, cb, errCb) {
    return simplyGet('services/InvestargetApi/user/CheckUserCommonTransaction?transactionid=' + getCurrentUserId() + '&Investorid=' + investorId, cb, errCb)
  },

  uploadCamCard(data, size) {
    return new Promise((resolve, reject) => {
      axios.post(
        'http://bcr2.intsig.net/BCRService/BCR_VCF2?PIN=abcd&user=summer.xia@investarget.com&pass=P8YSCG7AQLM66S7M&lang=2&json=1&size=' + size,
        data,
      ).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getSingleUserInfo(userId, cb, errCb) {
    return simplyGet('services/InvestargetApi/user/GetOne?input.lang=cn&input.id=' + userId, cb, errCb)
  },

  uploadBusinessCard(formData) {
    return upload('services/InvestargetApi/qiniuUploadService/CCUpload', formData)
  },

  uploadBusiness(file, cb, errCb) {
    console.log('in the method')
    return new Promise((resolve, reject) => {
      axios.post(
        url + 'services/InvestargetApi/qiniuUploadService/CCUpload',
        file,
        { headers: { 'Authorization': 'Bearer ' + getToken(), 'content-type': 'application/octet-stream' } }
      )
        .then(response => {
          console.log('Yxxxm', response.data)
          if (!response.data.success) {
            throw new ApiError(response.data.error)
          }
          const data = response.data.result
          if (cb) cb(data)
          resolve(data)
        })
        .catch(error => {
          if (errCb) errCb(error)
          reject(error)
        })
    })
  },

}

var md5 = function (string) {

  function RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }

  function AddUnsigned(lX,lY) {
    var lX4,lY4,lX8,lY8,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
	return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
	return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  function F(x,y,z) { return (x & y) | ((~x) & z); }
  function G(x,y,z) { return (x & z) | (y & (~z)); }
  function H(x,y,z) { return (x ^ y ^ z); }
  function I(x,y,z) { return (y ^ (x | (~z))); }

  function FF(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function GG(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function HH(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function II(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords-1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  };

  function WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  };

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
	utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
	utftext += String.fromCharCode((c >> 6) | 192);
	utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
	utftext += String.fromCharCode((c >> 12) | 224);
	utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  var x=Array();
  var k,AA,BB,CC,DD,a,b,c,d;
  var S11=7, S12=12, S13=17, S14=22;
  var S21=5, S22=9 , S23=14, S24=20;
  var S31=4, S32=11, S33=16, S34=23;
  var S41=6, S42=10, S43=15, S44=21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

  for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=AddUnsigned(a,AA);
    b=AddUnsigned(b,BB);
    c=AddUnsigned(c,CC);
    d=AddUnsigned(d,DD);
  }

  var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

  return temp.toLowerCase();
}

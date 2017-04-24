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

const baseUrl = '/'

export default {
  baseUrl,
  getCurrentUserId,
  getCurrentUserType,
  getCurrentUserInfo,
  
  getProjects(params, cb, errCb, skipCount = 0) {
    axios.get(url + 'services/InvestargetApi/project/GetProjects?input.revenueFrom=0&input.revenueTo=10000000000&netIncomeFrom=-2000000000&input.netIncomeTo=1000000000000&input.lang=cn' + params + '&input.skipCount=' + skipCount)
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

    axios.get(url + 'services/InvestargetApi/project/GetOne?input.lang=cn&device=phone&input.id=' + id, {
      headers: { 'Authorization': 'Bearer ' + (token || getToken()) }
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

  sendVerificationCode(mobile, cb, errCb) {
    const param = { rec_num: mobile }
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

  getUsers(cb, errCb) {
    return simplyGet('services/InvestargetApi/user/GetUserCommon?input.lang=cn&input.userId=' + getCurrentUserId(), cb, errCb)
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

  modifyUser(param, cb, errCb) {
    axios.put(url + 'services/InvestargetApi/user/ModifyUser?id=' + getCurrentUserId(), param, {
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

}

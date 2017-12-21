import React, { Component } from 'react'
import LoadingAndToast from './LoadingAndToast'
import { connect } from 'react-redux'
import { dismissErrMsg, logout, saveRedirectUrl } from '../actions'
import { withRouter } from 'react-router-dom'
import api from '../api'

class HandleError extends Component {

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isError) {
      setTimeout(() => {
        this.props.dispatch(dismissErrMsg())
        if (this.props.error.message === 'Request failed with status code 401' ||
            this.props.error.code == 3000) {
          this.props.dispatch(logout())
          this.props.dispatch(saveRedirectUrl(this.props.location.pathname))
          this.props.history.replace(api.baseUrl + '/login')
        }
      }, 1000)
    }
  }

  render() {
    var showError = false
    var errMsg = ''

    if (this.props.isError) {
      switch (this.props.error.name) {
        case 'Error':
          handleError(this.props.error)
          break
        case 'ApiError':
          handleApiError(this.props.error)
          break
        default:
          console.error(this.props.error)
      }
    }

    function handleError(error) {
      switch (error.message) {
        case 'Network Error':
          showError = true
          errMsg = '网络连接异常'
          break
        case 'No More Projects':
          showError = true
          errMsg = '没有结果'
          break
        case 'Please fetch SMS code first':
          showError = true
          errMsg = '请获取短信验证码'
          break
        case 'Please input valid Email':
          showError = true
          errMsg = '请输入有效的邮箱'
          break
        case 'mobile_not_valid':
          showError = true
          errMsg = '请输入有效的手机号码'
          break
        case 'Request failed with status code 401':
          showError = true
          errMsg = '验证失败，请重新登录'
          break
        case 'update success':
          showError = true
          errMsg = '修改成功'
          break
        case 'password not the same':
          showError = true
          errMsg = '两次输入的密码不一致'
          break
        case 'same password':
          showError = true
          errMsg = '新旧密码不能相同'
          break
        case 'Please contact to modify':
          showError = true
          errMsg = '请联系客服人员进行修改'
	  break
	case 'Please wait patient':
	  showError = true
	  errMsg = "图像更新需要时间，请耐心等待"
          break
        case 'content can not be empty':
          showError = true
          errMsg = "内容不能为空"
          break
        case 'mobile_or_email_possessed':
          showError = true
          errMsg = "手机或邮箱已被占用"
          break
        case 'parse_business_card_failed':
          showError = true
          errMsg = "名片解析失败"
          break
        default:
          console.error(error)
      }
    }

    function handleApiError(error) {
      switch (error.code) {
        case 120:
          showError = true
          errMsg = '用户名或密码错误'
          break
        case 100:
          showError = true
          errMsg = '账号还未通过审核，请耐心等待，相关工作人员会尽快完成审核流程。'
          break
        case 110:
          showError = true
          errMsg = '验证码错误'
          break
        case 200:
          showError = true
          errMsg = '旧密码错误'
          break
        case 2001:
        case 2002:
        case 20021:
        case 2003:
        case 2004:
        case 20042:
        case 2005:
        case 20051:
          showError = true
          errMsg = error.message
          break
        case 2014:
          showError = true
          errMsg = error.message
          break
        case 2015:
          showError = true
          errMsg = error.message
          break
        case 3000:
          showError = true
          errMsg = '请登录后访问'
        default:
          console.error(error)
      }
    }

    return <LoadingAndToast isError={showError} errorMsg={errMsg} />
  }

}

function mapStateToProps(state) {
  const { isError, error } = state
  return { isError, error }
}

export default withRouter(connect(mapStateToProps)(HandleError))

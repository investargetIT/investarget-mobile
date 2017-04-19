import React, { Component, PropTypes } from 'react'
import LoadingAndToast from './LoadingAndToast'
import { connect } from 'react-redux'
import { dismissErrMsg, logout } from '../actions'
import { withRouter } from 'react-router-dom'

class HandleError extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isError) {
      setTimeout(() => {
        this.props.dispatch(dismissErrMsg())
        if (this.props.error.message === 'Request failed with status code 401') {
          this.props.dispatch(logout())
          this.props.history.push('/login')
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

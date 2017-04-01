import React, { Component } from 'react'
import LoadingAndToast from './LoadingAndToast'
import { connect } from 'react-redux'
import { dismissErrMsg } from '../actions'

class HandleError extends Component {

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isError) {
      setTimeout(() => this.props.dispatch(dismissErrMsg()), 1000)
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
        default:
          console.error(error)
      }
    }

    function handleApiError(error) {
      switch (error.code) {
        case 0:
          showError = true
          errMsg = '用户名或密码错误'
          break
        case 100:
          showError = true
          errMsg = '账号还未通过审核，请耐心等待，相关工作人员会尽快完成审核流程。'
          break
        default:
          console.error(error)
      }
    }

    return <LoadingAndToast isError={showError} errorMsg={errMsg} />
  }

}

function mapStateToProps(state) {
  const isError = state.isError
  const error = state.error
  return { isError, error }
}

export default connect(mapStateToProps)(HandleError)
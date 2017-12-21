import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { connect } from 'react-redux'
import { requestContents, handleError, hideLoading } from '../actions'
import LeftLabelRightContent from '../components/LeftLabelRightContent'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const inputStyle = {
  fontSize: '16px',
  width: '96%',
  border: 'none'
}

class ModifyPassword extends Component {

  constructor(props) {
    super(props)

    this.state = {
      old: '',
      new: '',
      confirm: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
   const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit() {
    
    if (this.state.old === '' || this.state.new === '' || this.state.confirm === '') {
      return
    }

    if (this.state.new !== this.state.confirm) {
      this.props.dispatch(handleError(new Error('password not the same')))
      return
    }

    if (this.state.new === this.state.old) {
      this.props.dispatch(handleError(new Error('same password')))
      return
    }

   this.props.dispatch(requestContents(''))

   newApi.modifyPassword(utils.getCurrentUserId(), this.state.old, this.state.new)
    .then(data => {
      this.props.dispatch(hideLoading())
      this.props.dispatch(handleError(new Error('update success')))
      this.props.history.goBack()
    })
    .catch(error => {
      this.props.dispatch(handleError(error))
    })

    // api.modifyPassword(
    //   this.state.old,
    //   this.state.new,
    //   () => {
    //     this.props.dispatch(hideLoading())
    //     this.props.dispatch(handleError(new Error('update success')))
    //     this.props.history.goBack()
    //   },
    //   error => this.props.dispatch(handleError(error))
    // )
  }

  render() {
    return (
      <div>
        <NavigationBar title="修改密码" action="提交" onActionButtonClicked={this.handleSubmit} />

        <div style={containerStyle}>

          <LeftLabelRightContent
            label="旧密码"
            content={
              <input
                name="old"
                style={inputStyle}
                type="password"
                placeholder="请输入旧密码"
                onChange={this.handleInputChange}
              />
            }
          />

          <LeftLabelRightContent
            label="新密码"
            content={
              <input
                name="new"
                style={inputStyle}
                type="password"
                placeholder="请输入新密码(新旧密码不能相同)"
                onChange={this.handleInputChange}
              />
            }
          />

          <LeftLabelRightContent
            label="新密码确认"
            content={
              <input
                name="confirm"
                style={inputStyle}
                type="password"
                placeholder="请再次输入新密码"
                onChange={this.handleInputChange}
              />
            }
          />

        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo } = state
  return { tags, userInfo }
}

export default connect(mapStateToProps)(ModifyPassword)
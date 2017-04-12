import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { connect } from 'react-redux'
import { requestContents, handleError, hideLoading } from '../actions'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const itemContainerStyle = {
  backgroundColor: 'white',
  marginBottom: '1px'
}

const labelContainerStyle = {
  float: 'left',
  width: '30%',
  lineHeight: '42px',
  fontSize: '16px',
  paddingLeft: '20px'
}

const inputContainerStyle = {
  lineHeight: '42px',
  marginLeft: '30%'
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

    api.modifyPassword(
      this.state.old,
      this.state.new,
      () => {
        this.props.dispatch(hideLoading())
        this.props.dispatch(handleError(new Error('update success')))
        this.props.history.goBack()
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  render() {
    return (
      <div>
        <NavigationBar title="修改密码" action="提交" onActionButtonClicked={this.handleSubmit} />

        <div style={containerStyle}>

            <div style={itemContainerStyle}>
              <div style={labelContainerStyle}>旧密码</div>
              <div style={inputContainerStyle}><input name="old" style={inputStyle} type="password" placeholder="请输入旧密码" onChange={this.handleInputChange} /></div>
            </div>

            <div style={itemContainerStyle}>
              <div style={labelContainerStyle}>新密码</div>
              <div style={inputContainerStyle}><input name="new" style={inputStyle} type="password" placeholder="请输入新密码（新旧密码不能相同）" onChange={this.handleInputChange} /></div>
            </div>

            <div style={itemContainerStyle}>
              <div style={labelContainerStyle}>新密码确认</div>
              <div style={inputContainerStyle}><input name="confirm" style={inputStyle} type="password" placeholder="请再次输入新密码" onChange={this.handleInputChange} /></div>
            </div>

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
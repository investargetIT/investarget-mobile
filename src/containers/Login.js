import React from 'react'
import { requestContents, receiveCurrentUserInfo, handleError } from '../actions'
import { connect } from 'react-redux'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import FormContainer from './FormContainer'
import { Link } from 'react-router-dom'
import api from '../api'


var usernameInputStyle = {
  margin: '30px 10px',
}

var passwordInputStyle = {
  margin: '30px 10px 40px',
}

var loginButtonStyle = {
  margin: '10px 0',
  fontSize: '16px',
}

var registerButtonStyle = {
  margin: '10px 0',
  fontSize: '16px',
}

var forgetPasswordStyle = {
  textAlign: 'center',
  marginTop: '20px',
}

var forgetPasswordLinkStyle = {
  color: 'rgb(34, 105, 212)',
}

var showPasswordStyle = {
  padding: '5px',
}

var showPasswordIconStyle = {
  width: '20px',
  height: '20px',
  verticalAlign: 'top',
}

class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      showPassword: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.togglePassword = this.togglePassword.bind(this)
    this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
  }

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push(api.baseUrl + "/")
    }
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {

    const param = {
      mobileOrEmailAddress: this.state.username,
      password: this.state.password,
      app: 3
    }

    this.props.dispatch(requestContents(''))
    api.loginAndGetUserInfo(
      param,
      (authToken, userInfo) => {
	this.props.dispatch(receiveCurrentUserInfo(authToken, userInfo, this.state.username, this.state.password))
	var redirectUrl = this.props.redirectUrl || api.baseUrl + "/" 
	const isProjectRoute = /project\/\d+/g.exec(redirectUrl)
	if (isProjectRoute) {
	  redirectUrl += this.props.userInfo ? '?token=' + this.props.userInfo.token : ''
	  window.location.replace(redirectUrl)
	} else {
	  this.props.history.push(redirectUrl)
	}
      },
      error => this.props.dispatch(handleError(error))
    )

  }

  togglePassword(event) {
    console.log(event)
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  handleBackIconClicked() {
    this.props.history.push(api.baseUrl + '/')
  }

  render() {

    var showPassword = 
      <div style={showPasswordStyle} onClick={this.togglePassword}>
        <img src={api.baseUrl + (this.state.showPassword ? "/images/login/eyeOpen@2x.png" : "/images/login/eyeClose@2x.png")} style={showPasswordIconStyle} alt="" />
      </div>
    
    var content = (
      <div>

        <div style={usernameInputStyle}>
          <TextInput iconUrl={api.baseUrl + "/images/login/User-copy@2x.png"} iconAlt="用户名" name="username" placeholder="请输入手机号/邮箱" handleInputChange={this.handleInputChange} />
        </div>

        <div style={passwordInputStyle}>
          <TextInput iconUrl={api.baseUrl + "/images/login/Locked@2x.png"} iconAlt="密码" name="password" type={this.state.showPassword ? 'text' : 'password'} placeholder="请输入密码" handleInputChange={this.handleInputChange} rightContent={showPassword} />
        </div>

        <div style={loginButtonStyle}>
          <Button type="primary" disabled={this.state.username === '' || this.state.password === ''} onClick={this.handleSubmit} value="登录" />
        </div>

        <div style={registerButtonStyle}>
          <Link to={api.baseUrl + "/register"}><Button type="secondary" isTransparent="true" value="注册" /></Link>
        </div>

        <div style={forgetPasswordStyle}>
          <Link to={api.baseUrl + "/retrieve_password"} style={forgetPasswordLinkStyle}>忘记密码？</Link>
        </div>

      </div>
    )
    return <FormContainer title="登录" backIconClicked={this.handleBackIconClicked} innerHtml={content} />
  }

}

function mapStateToProps(state) {
  const { redirectUrl, userInfo, isLogin } = state
  return { redirectUrl, userInfo, isLogin }
}

export default connect(mapStateToProps)(Login)

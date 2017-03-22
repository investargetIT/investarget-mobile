import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../actions'
import { connect } from 'react-redux'
import TextInput from './TextInput'
import Button from './Button'

var container = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url(images/login/backgroungImage@2x.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}

var backIconContainerStyle = {
  width: '36px',
  height: '36px',
  float: 'left',
  textAlign: 'center'
}

var titleStyle = {
  marginRight: '36px',
  lineHeight: '36px',
  textAlign: 'center'
}

var backIconStyle = {
  marginTop: '8px',
  width: '9px',
  height: '15px'
}

var formContainer = {
  width: '80%',
  margin: '200px auto'
}

class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
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

  handleSubmit(event) {
    this.props.dispatch(
      login({
        mobileOrEmailAddress: this.state.username,
        password: this.state.password,
        app: 1
      })
    )
  }

  render() {
    if (this.props.isLogin) {
      return (
        <Redirect to="/" />
      )
    }
    return (
      <div style={container}>

        <Link to="/user">
          <div style={backIconContainerStyle}>
            <img style={backIconStyle} src="images/login/backButton@3x.png" alt="Back" />
          </div>
        </Link>

        <p style={titleStyle}>登录</p>

        <div style={formContainer}>

          <TextInput iconUrl="images/login/User-copy@2x.png" iconAlt="用户名" name="username" placeholder="请输入手机号/邮箱" handleInputChange={this.handleInputChange} />

          <TextInput iconUrl="images/login/Locked@2x.png" iconAlt="密码" name="password" placeholder="请输入密码" handleInputChange={this.handleInputChange} />

          <Button disabled={this.state.username==='' || this.state.password===''} handleSubmit={this.handleSubmit} value="登录" />

          <Button isTransparent="true" value="注册" />

          <p>忘记密码？</p>

        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const isLogin = state.isLogin
  return {isLogin}
}

export default connect(mapStateToProps)(Login)
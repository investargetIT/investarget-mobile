import React from 'react'
import { login } from '../actions'
import { connect } from 'react-redux'
import TextInput from './TextInput'
import Button from './Button'
import FormContainer from './FormContainer'
import { Link } from 'react-router-dom'

var showPasswordStyle = {
  width: '20px',
  height: '20px'
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

    var showPassword = <img src="images/login/eyeClose@2x.png" style={showPasswordStyle} alt="" />
    var content = (
      <div>

        <TextInput iconUrl="images/login/User-copy@2x.png" iconAlt="用户名" name="username" placeholder="请输入手机号/邮箱" handleInputChange={this.handleInputChange} />

        <TextInput iconUrl="images/login/Locked@2x.png" iconAlt="密码" name="password" placeholder="请输入密码" handleInputChange={this.handleInputChange} rightContent={showPassword} />

        <Button disabled={this.state.username === '' || this.state.password === ''} onClick={this.handleSubmit} value="登录" />

        <Link to="/register"><Button isTransparent="true" value="注册" /></Link>

        <p>忘记密码？</p>

      </div>
    )
    return <FormContainer title="登录" previousPage="/" innerHtml={content} />
  }

}

export default connect()(Login)
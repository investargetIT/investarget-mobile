import React from 'react'
import { requestContents, receiveCurrentUserInfo, handleError, hideLoading } from '../actions'
import { connect } from 'react-redux'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import FormContainer from './FormContainer'
import { Link } from 'react-router-dom'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import qs from 'qs'

const inWxApp = newApi.inWxApp;

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
      if (inWxApp) {
        this.props.history.push(api.baseUrl + "/user")
      } else {
        this.props.history.push(api.baseUrl + "/")
      }
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
      username: this.state.username,
      password: this.state.password,
    }

    this.props.dispatch(requestContents(''))

    let projectID, isMarketPlace;
    newApi.login(param)
      .then(data => {
        const { token: authToken, user_info, permissions } = data
        this.props.dispatch(hideLoading())
        const userInfo = utils.convertUserInfo(user_info, permissions)
        this.props.dispatch(receiveCurrentUserInfo(authToken, userInfo, this.state.username, this.state.password))
        let redirectUrl = this.props.redirectUrl || api.baseUrl + "/" 
        const isProjectRoute = /project\/detail\?projectID=(.*)&isMarketPlace=(.*)/.test(redirectUrl);
        if (!isProjectRoute) {
          this.props.history.push(redirectUrl);
          return;
        }
        
        const params = qs.parse(redirectUrl.split('?')[1]);
        projectID = params.projectID;
        isMarketPlace = params.isMarketPlace;

        if (isMarketPlace == "false") {
          return newApi.getShareToken(projectID);
        } else {
          return newApi.getProjLangDetail(projectID);
        }
      })
      .then(result => {
        if (isMarketPlace === 'false') {
          window.location.replace(`${api.baseUrl}/project/${projectID}?token=${result}`);
        } else if (isMarketPlace === 'true') {
          const fileUrl = result.linkpdfurl
          const userInfo = this.props.userInfo
          const email = (userInfo && userInfo.emailAddress) ? userInfo.emailAddress : 'deal@investarget.com'
          const url = '/pdf_viewer.html?file=' + encodeURIComponent(fileUrl) + '&watermark=' + encodeURIComponent(email)
          window.location.replace(url);
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })

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

  componentWillMount() {
    if (inWxApp) this.props.history.push("/wxlogin" + this.props.location.search)
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

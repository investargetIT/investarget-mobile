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

const inWxApp = window.__wxjs_environment === 'miniprogram';
const VERIFICATION_CODE_TOKEN = 'VERIFICATION_CODE_TOKEN'

var wxAvatar = {
  margin: '0 auto',
  display: 'block',
  position: 'relative',
  backgroundSize: 'cover',
  width: 80, height: 80,
  borderRadius: 80,
  // border: "2px solid rgba(26, 173, 25, .6)"
}

var wxNickName = {
  margin: '0 auto',
  display: 'block',
  position: 'relative',
  marginTop: 10,
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
  marginBottom: 40
}

var buttonStyle = {
  margin: '10px 0',
  fontSize: '16px',
}

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

var codeInputStyle = {
  margin: '30px 10px',
}

var sendCodeButtonStyle = {
  width: '90px',
  fontSize: '14px',
  background: 'rgb(34, 105, 212)',
  border: '1px solid rgb(34, 105, 212)',
  color: 'white',
  borderRadius: '4px',
  lineHeight: '26px',
  height: '26px',
  borderRadius: '13px',
}

var sendCodeButtonDisabledStyle = Object.assign({}, sendCodeButtonStyle, {
  background: 'grey',
  border: '1px solid grey',
})

var emailInputStyle = {
  margin: '30px 10px',
}

var showPasswordStyle = {
  padding: '5px',
}

var showPasswordIconStyle = {
  width: '20px',
  height: '20px',
  verticalAlign: 'top',
}

class WxLogin extends React.Component {

  constructor(props) {
    super(props)

    this.wxid = null;
    this.userInfo = null;
    let wxList = props.location.search.substr(1).split('&').filter(k => k.startsWith("wxid="))[0]
    let infoList = props.location.search.substr(1).split('&').filter(k => k.startsWith("userInfo="))[0]
    if (wxList) {
      this.wxid = wxList.substr(5).trim().split(",")
      this.wxidIndex = 0
    }
    if (infoList) {
      this.userInfo = JSON.parse(unescape(infoList.substr(9)))
      localStorage.setItem("WXUSERINFO", JSON.stringify(this.userInfo));
    }

    this.state = {
      username: '',
      password: '',
      doLogin: true,
      doReset: false,
      showPassword: false,
      userInfo: this.userInfo || {},
      code: '',
      token: '',
      email: '',
      license: true,
      fetchCodeWaitingTime: 0,
      timer: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.checkEmailFormat = this.checkEmailFormat.bind(this)
    this.togglePassword = this.togglePassword.bind(this)
    this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
    this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this)
  }

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push(api.baseUrl + "/user")
    }
  }

  handleSendVerificationCode(event) {
    const react = this

    // api.sendVerificationCode
    const param = {
      mobile: this.state.username,
      areacode: "86",
    }
    newApi.sendSmsCode(param)
      .then(data => {

        const { status, smstoken: token, msg } = data

        if (status !== 'success') {
          throw new Error(msg)
        }

        localStorage.setItem(VERIFICATION_CODE_TOKEN, token)

        react.setState({ 
          fetchCodeWaitingTime: 60,
          token: token
        })

        let timer = setInterval(
          () => {
            if (react.state.fetchCodeWaitingTime <= 0) {
              clearInterval(timer)
              react.setState({ fetchCodeWaitingTime: 0 })
              return
            }
            react.setState({ fetchCodeWaitingTime: react.state.fetchCodeWaitingTime - 1 })
          }, 1000
        )

        react.setState({ timer: timer })
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })
  }

  checkPhoneExist() {
    
    // api.checkMobileOrEmailExist
    if (`${parseInt(this.state.username, 10)}`.length !== 11) return;
    newApi.checkUserExist(this.state.username)
      .then(data => {
        const user = data.user
        if (user) {
          if (user.is_active) {
            this.setState({doLogin: true, doReset: false})
          } else {
            this.setState({doLogin: false, doReset: true})
          }
        } else {
          this.setState({doLogin: false, doReset: false})
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })

  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })

    if (name === "username") this.debounce(this.checkPhoneExist.bind(this), 300);
  }

  debounce(fn, period, ...args) {
    if (this.schedule) clearTimeout(this.schedule);
    this.schedule = setTimeout(() => {
      this.schedule = null; fn(args);
    }, period);
  }

  handleLogin(event) {

    if (this.wxidIndex >= this.wxid.length) this.wxidIndex = this.wxid.length - 1
    const param = {
      username: this.state.username,
      password: this.state.password,
      wxid: this.wxid[this.wxidIndex++]
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
        
        this.props.history.push("/user");
      })
      .catch(error => {

        if (error.code === 2050 && window.wx && this.wxidIndex < 2) {
          window.wx.miniProgram.reLaunch({url: '/pages/user/user'})
        }
        this.props.dispatch(handleError(error))
      })

  }

  handleReset() {

    const token = localStorage.getItem(VERIFICATION_CODE_TOKEN)
    if (!token) {
      this.props.dispatch(handleError(new Error('Please fetch SMS code first')))
      return
    }

    const param = {
      mobile: this.state.username,
      mobilecodetoken: token,
      mobilecode: this.state.code,
      password: this.state.password
    }

    newApi.retrievePassword(param)
        .then(data => {
          localStorage.removeItem(VERIFICATION_CODE_TOKEN)
          this.handleLogin()
        })
        .catch(error => {
            this.props.dispatch(handleError(error))
        })

  }

  handleSubmit(userType) {

    const token = localStorage.getItem(VERIFICATION_CODE_TOKEN)
    if (!token) {
      this.props.dispatch(handleError(new Error('Please fetch SMS code first')))
      return
    }
    if (!this.checkEmailFormat()) {
      this.props.dispatch(handleError(new Error('Please input valid Email')))
      return
    }

    var registerParams = {
      username: this.userInfo.nickName,
      prefix: '86',
      mobile: this.state.username,
      smstoken: token,
      code: this.state.code,
      email: this.state.email,
      userType: userType,
      password: this.state.password
      
    }
    
    this.props.dispatch(requestContents(''))

    newApi.register(registerParams)
      .then(data => {
        localStorage.removeItem(VERIFICATION_CODE_TOKEN)
        this.handleLogin()
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })

  }

  checkEmailFormat() {
    var re = /[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z0-9_\-\.]+/
    return re.test(this.state.email)
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
    if (inWxApp && window.wx && this.wxid && this.userInfo) {
      this.handleLogin()
    }
  }

  render() {

    var showPassword = 
      <div style={showPasswordStyle} onClick={this.togglePassword}>
        <img src={api.baseUrl + (this.state.showPassword ? "/images/login/eyeOpen@2x.png" : "/images/login/eyeClose@2x.png")} style={showPasswordIconStyle} alt="" />
      </div>
    const isMobileInvalid = this.state.username == ''
    const sendCodeDisabled = isMobileInvalid || this.state.fetchCodeWaitingTime !== 0
    const sendCodeStyle = sendCodeDisabled ? sendCodeButtonDisabledStyle : sendCodeButtonStyle
    const sendCodeButtonValue = this.state.fetchCodeWaitingTime === 0 ? '发送验证码' : this.state.fetchCodeWaitingTime + 's'
    
    var sendCode = <button disabled={sendCodeDisabled} style={sendCodeStyle} onClick={this.handleSendVerificationCode}>{sendCodeButtonValue}</button>

    var disabled = this.state.username && this.state.password && this.state.code && this.state.email;
    var content = (
      <div>

        <div>
          <img style={wxAvatar} src={this.state.userInfo.avatarUrl || api.baseUrl + "/images/shareLogo@2x.png"} />
          <span style={wxNickName}>{this.state.userInfo.nickName}</span>
        </div>

        <div style={usernameInputStyle}>
          <TextInput name="username" placeholder="请输入手机号" handleInputChange={this.handleInputChange} />
        </div>

        {this.state.doLogin ? null : 
        <div style={codeInputStyle}>
          <TextInput name="code" placeholder="请输入验证码" value={this.state.code} handleInputChange={this.handleInputChange} rightContent={sendCode} />
        </div>}

        <div style={passwordInputStyle}>
          <TextInput name="password" type={this.state.showPassword ? 'text' : 'password'} placeholder="请输入密码" handleInputChange={this.handleInputChange} rightContent={showPassword} />
        </div>

        {this.state.doLogin ? 

          <div style={loginButtonStyle}>
            <Button type="primary" disabled={this.state.username === '' || this.state.password === ''} onClick={this.handleLogin} value="绑定" />
          </div>

        :

        <div>

          { this.state.doReset ? null :
          <div style={emailInputStyle}>
            <TextInput name="email" placeholder="请输入邮箱" value={this.state.email} handleInputChange={this.handleInputChange} />
          </div>
          }

          { this.state.doReset ? 
          <div style={loginButtonStyle}>
            <Button type="primary" disabled={this.state.username === '' || this.state.password === ''} onClick={this.handleReset} value="激活" />
          </div>
          :
          <div>
            <div style={buttonStyle}>
              <div style={{marginTop: 50}}></div>
              <Button name="transaction" type="primary" disabled={!disabled} onClick={this.handleSubmit.bind(this, 'trader')} value="我是交易师" />
            </div>

            <div style={buttonStyle}>
              <Button name="investor" type="primary" disabled={!disabled} onClick={this.handleSubmit.bind(this, 'investor')} value="我是投资人" />
            </div>
          </div>
          }

        </div>
        
        }
        

       

      </div>
    )
    return <FormContainer title="绑定小程序" style={{backgroundImage: `url(${api.baseUrl}/images/login/backgroundImage@2x.png`}} formStyle={{margin: '15% auto 35%'}} backIconClicked={this.handleBackIconClicked} innerHtml={content} root />
  }

}

function mapStateToProps(state) {
  const { redirectUrl, userInfo, isLogin } = state
  return { redirectUrl, userInfo, isLogin }
}

export default connect(mapStateToProps)(WxLogin)

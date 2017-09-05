import React from 'react'
import FormContainer from './FormContainer'
import TextInput from '../components/TextInput'
import MobileInput from '../components/MobileInput'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import api from '../api'
import * as newApi from '../api3.0'
import { handleError } from '../actions'
import { connect } from 'react-redux'

const REGISTER_BASIC_INFO = 'REGISTER_BASIC_INFO'
const VERIFICATION_CODE_TOKEN = 'VERIFICATION_CODE_TOKEN'

var phoneInputStyle = {
  margin: '30px 10px',
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

var buttonStyle = {
  margin: '10px 0',
  fontSize: '16px',
}

var licenseStyle = {
  marginTop: '30px',
  textAlign: 'center',
}

var licenseCheckStyle = {
  verticalAlign: 'middle',
  marginRight: '4px',
}

var licenseLinkStyle = {
  verticalAlign: 'middle',
  color: '#999',
}

class Register extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      userExist: null,
      areaCode: '86',
      mobile: '',
      code: '',
      email: '',
      license: true,
      fetchCodeWaitingTime: 0,
      timer: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.checkPhoneExist = this.checkPhoneExist.bind(this)
    this.checkEmailFormat = this.checkEmailFormat.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this)
  }

  componentDidMount() {
    
    const registerBasicInfo = JSON.parse(localStorage.getItem(REGISTER_BASIC_INFO))
    if (registerBasicInfo) {
      this.setState({
        mobile: registerBasicInfo.mobile,
        code: registerBasicInfo.code,
        email: registerBasicInfo.email
      })
    }
  }

  handleMobileChange = ({ areaCode, mobile }) => {
    this.setState({ areaCode, mobile })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name

    this.setState({
      [name]: value
    })

    if (name == 'mobile') {
      this.setState({ userExist: null })
    }
  }

  handleSendVerificationCode(event) {
    const react = this

    // api.sendVerificationCode
    const param = {
      mobile: this.state.mobile,
      areacode: this.state.areaCode,
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

        var timer = setInterval(
          () => react.setState({ fetchCodeWaitingTime: react.state.fetchCodeWaitingTime - 1 }),
          1000
        )

        react.setState({ timer: timer })
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })
  }

  checkPhoneExist() {
    
    // api.checkMobileOrEmailExist
    newApi.checkUserExist(this.state.mobile)
      .then(data => {
        const exist = data.result
        if (exist) {
          this.setState({userExist: true})
          this.props.history.push(api.baseUrl + '/set_password', {
            mobile: this.state.mobile,
            areaCode: this.state.areaCode,
          })
        } else {
          this.setState({userExist: false})
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })

  }

  checkEmailFormat() {
    var re = /[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z0-9_\-\.]+/
    return re.test(this.state.email)
  }

  handleSubmit(userType) {

    const token = localStorage.getItem(VERIFICATION_CODE_TOKEN)
    if (!token) {
      this.props.dispatch(handleError(new Error('Please fetch SMS code first')))
      return
    }
    if (!this.checkEmailFormat()) {
      this.props.dispatch(handleError(new Error('Please input valid Email')))
      console.log(this.checkEmailFormat())
      return
    }

    var registerBasicInfo = {
      mobile: this.state.mobile,
      token: token,
      code: this.state.code,
      email: this.state.email,
      userType: userType
    }
    localStorage.setItem(REGISTER_BASIC_INFO, JSON.stringify(registerBasicInfo))
    this.props.history.push(api.baseUrl + '/register2')

  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  render() {
    
    if (this.state.fetchCodeWaitingTime === 0) {
      clearInterval(this.state.timer)
    }
    const isMobileInvalid = this.state.mobile == ''
    const sendCodeDisabled = isMobileInvalid || this.state.fetchCodeWaitingTime !== 0
    const sendCodeStyle = sendCodeDisabled ? sendCodeButtonDisabledStyle : sendCodeButtonStyle
    const sendCodeButtonValue = this.state.fetchCodeWaitingTime === 0 ? '发送验证码' : this.state.fetchCodeWaitingTime + 's'
    
    var sendCode = <button disabled={sendCodeDisabled} style={sendCodeStyle} onClick={this.handleSendVerificationCode}>{sendCodeButtonValue}</button>


    var disabled;
    if (isMobileInvalid) {
      disabled = true
    } else {
      if (this.state.userExist === false) {
        disabled = this.state.mobile === '' || this.state.code === '' || this.state.email === '' || !this.state.license
      } else {
        disabled = false
      }
    }
    
    var content = (
      <div>

        <div style={phoneInputStyle}>
          <MobileInput areaCode={this.state.areaCode} mobile={this.state.mobile} onChange={this.handleMobileChange} />
        </div>

        <div style={this.state.userExist === false ? codeInputStyle : {display: 'none'}}>
          <TextInput name="code" placeholder="请输入验证码" value={this.state.code} handleInputChange={this.handleInputChange} rightContent={sendCode} />
        </div>

        <div style={this.state.userExist === false ? emailInputStyle : {display: 'none'}}>
          <TextInput name="email" placeholder="请输入邮箱" value={this.state.email} handleInputChange={this.handleInputChange} />
        </div>

        <div style={this.state.userExist === false ? buttonStyle : {display: 'none'}}>
          <Button name="transaction" type="primary" disabled={disabled} onClick={this.handleSubmit.bind(this, 'trader')} value="我是交易师" />
        </div>

        <div style={this.state.userExist === false ? buttonStyle : {display: 'none'}}>
          <Button name="investor" type="primary" disabled={disabled} onClick={this.handleSubmit.bind(this, 'investor')} value="我是投资人" />
        </div>

        <div style={this.state.userExist === false ? licenseStyle : {display: 'none'}}>
          <input name="license" style={licenseCheckStyle} type="checkbox" checked={this.state.license} onChange={this.handleInputChange} />
          <Link style={licenseLinkStyle} to={api.baseUrl + "/agreement"}>用户协议</Link>
        </div>

        <div style={this.state.userExist === null ? buttonStyle : {display: 'none'}}>
          <Button name="next" type="primary" value="下一步" onClick={this.checkPhoneExist} disabled={isMobileInvalid} />
        </div>

      </div>
    )
    return <FormContainer previousPage={api.baseUrl + "/login"} title="注册" innerHtml={content} />
  }

}

export default connect()(Register)

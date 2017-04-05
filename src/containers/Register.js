import React from 'react'
import FormContainer from './FormContainer'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import api from '../api'
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

var liscenseStyle = {
  marginTop: '30px',
  textAlign: 'center',
}

var liscenseCheckStyle = {
  verticalAlign: 'middle',
  marginRight: '4px',
}

var liscenseLinkStyle = {
  verticalAlign: 'middle',
  color: '#999',
}

class Register extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      mobile: '',
      code: '',
      email: '',
      liscense: true,
      fetchCodeWaitingTime: 0,
      timer: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
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

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSendVerificationCode(event) {
    const react = this

    api.sendVerificationCode(
      this.state.mobile,
      token => {

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
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  handleSubmit(event) {
    console.log(event.target.name)

    const token = localStorage.getItem(VERIFICATION_CODE_TOKEN)
    if (!token) {
      this.props.dispatch(handleError(new Error('Please fetch SMS code first')))
      return
    }

    const param = {
      mobile: this.state.mobile,
      token: token,
      code: this.state.code
    }
    api.checkVerificationCode(
      param,
      () => {
        var registerBasicInfo = Object.assign({}, param, {
          email: this.state.email
        })
        delete registerBasicInfo.token
        localStorage.setItem(REGISTER_BASIC_INFO, JSON.stringify(registerBasicInfo))
        this.props.history.push('/register2')
      },
      error => this.props.dispatch(handleError(error))
    )
    
  }

  render() {
    
    if (this.state.fetchCodeWaitingTime === 0) {
      clearInterval(this.state.timer)
    }
    const isMobileInvalid = /^1[34578]\d{9}$/.test(this.state.mobile) ? false : true
    const sendCodeStyle = isMobileInvalid || this.state.fetchCodeWaitingTime !== 0 ? sendCodeButtonDisabledStyle : sendCodeButtonStyle
    const sendCodeButtonValue = this.state.fetchCodeWaitingTime === 0 ? '发送验证码' : this.state.fetchCodeWaitingTime + 's'
    var sendCode = <button disabled={isMobileInvalid} style={sendCodeStyle} onClick={this.handleSendVerificationCode}>{sendCodeButtonValue}</button>
    
    var disabled = isMobileInvalid || this.state.code === '' || this.state.email === ''
    
    var content = (
      <div>

        <div style={phoneInputStyle}>
          <TextInput name="mobile" placeholder="请输入手机号" value={this.state.mobile} handleInputChange={this.handleInputChange} />
        </div>

        <div style={codeInputStyle}>
          <TextInput name="code" placeholder="请输入验证码" value={this.state.code} handleInputChange={this.handleInputChange} rightContent={sendCode} />
        </div>

        <div style={emailInputStyle}>
          <TextInput name="email" placeholder="请输入邮箱" value={this.state.email} handleInputChange={this.handleInputChange} />
        </div>

        <div style={buttonStyle}>
          <Button name="transaction" type="primary" disabled={disabled} onClick={this.handleSubmit} value="我是交易师" />
        </div>

        <div style={buttonStyle}>
          <Button name="investor" type="primary" disabled={disabled} onClick={this.handleSubmit} value="我是投资人" />
        </div>

        <div style={liscenseStyle}>
          <input name="liscense" style={liscenseCheckStyle} type="checkbox" checked={this.state.liscense} onChange={this.handleInputChange} />
          <Link style={liscenseLinkStyle} to="/">用户协议</Link>
        </div>

      </div>
    )
    return <FormContainer previousPage="/login" title="注册" innerHtml={content} />
  }

}

export default connect()(Register)
import React from 'react'
import FormContainer from './FormContainer'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Link } from 'react-router-dom'


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
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    alert(event.target.name)
    console.log(this.state)
  }

  render() {
    var disabled = this.state.mobile === '' || this.state.code === '' || this.state.email === ''
    var sendCode = <button style={sendCodeButtonStyle}>发送验证码</button>
    
    
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

export default Register
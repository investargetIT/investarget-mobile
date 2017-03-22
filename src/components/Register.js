import React from 'react'
import FormContainer from './FormContainer'
import TextInput from './TextInput'
import Button from './Button'

class Register extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      mobile: '',
      code: '',
      email: ''
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
    alert(event.target.name)
    console.log(this.state)
  }

  render() {
    var disabled = this.state.mobile === '' || this.state.code === '' || this.state.email === ''
    var sendCode = <button>发送验证码</button>
    var content = (
      <div>

        <TextInput name="mobile" placeholder="请输入手机号" handleInputChange={this.handleInputChange} />

        <TextInput name="code" placeholder="请输入验证码" handleInputChange={this.handleInputChange} rightContent={sendCode} />

        <TextInput name="email" placeholder="请输入邮箱" handleInputChange={this.handleInputChange} />

        <Button name="transaction" disabled={disabled} onClick={this.handleSubmit} value="我是交易师" />

        <Button name="investor" disabled={disabled} onClick={this.handleSubmit} value="我是投资人" />

        <p>用户协议</p>

      </div>
    )
    return <FormContainer previousPage="/login" title="注册" innerHtml={content} />
  }

}

export default Register
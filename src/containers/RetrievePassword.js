import React from 'react'
import FormContainer from './FormContainer'
import TextInput from '../components/TextInput'
import MobileInput from '../components/MobileInput'
import Button from '../components/Button'
import api from '../api'
import * as newApi from '../api3.0'
import { handleError } from '../actions'
import { connect } from 'react-redux'
import Modal from '../components/Modal'


const VERIFICATION_CODE_TOKEN = 'VERIFICATION_CODE_TOKEN'


var inputStyle = {
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
var buttonStyle = {
  margin: '10px 0',
  fontSize: '16px',
}


class RetrievePassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            areaCode: '86',
            mobile: '',
            code: '',
            newPassword: '',
            fetchCodeWaitingTime: 0,
            timer: null,
            showModal: false,
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRetrievePasswordSuccess = this.handleRetrievePasswordSuccess.bind(this)
    }

    handleMobileChange = ({ areaCode, mobile }) => {
        this.setState({ areaCode, mobile })
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.value;
        const name = target.name

        this.setState({
            [name]: value
        })
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

                clearInterval(this.state.timer)
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

    handleSubmit(event) {

        const token = localStorage.getItem(VERIFICATION_CODE_TOKEN)
        if (!token) {
            this.props.dispatch(handleError(new Error('Please fetch SMS code first')))
            return
        }

        const param = {
            mobile: this.state.mobile,
            mobilecodetoken: token,
            mobilecode: this.state.code,
            password: this.state.newPassword,
            datasource: 1, // TODO 等军柯代码部署到测试服务器时，删掉这行
        }
        newApi.retrievePassword(param)
            .then(data => {
                this.setState({ showModal: true })
            })
            .catch(error => {
                this.props.dispatch(handleError(error))
            })
        
    }

    handleRetrievePasswordSuccess() {
        this.setState({ showModal: false })
        this.props.history.goBack()
    }

    componentWillUnmount() {
        clearInterval(this.state.timer)
    }

    render() {
        if (this.state.fetchCodeWaitingTime <= 0) {
            clearInterval(this.state.timer)
        }
        const isMobileInvalid = this.state.mobile == ''
        const sendCodeButtonValue = this.state.fetchCodeWaitingTime === 0 ? '发送验证码' : this.state.fetchCodeWaitingTime + 's'
        const sendCodeDisabled = isMobileInvalid || this.state.fetchCodeWaitingTime !== 0
        const sendCodeStyle = sendCodeDisabled
                                ? sendCodeButtonDisabledStyle
                                : sendCodeButtonStyle
        var sendCode = <button disabled={sendCodeDisabled} style={sendCodeStyle} onClick={this.handleSendVerificationCode}>{sendCodeButtonValue}</button>

        var disabled = isMobileInvalid || this.state.code === '' || this.state.email === ''

        var content = (
            <div>
                <div style={inputStyle}>
                    <MobileInput areaCode={this.state.areaCode} mobile={this.state.mobile} onChange={this.handleMobileChange} />
                </div>
                <div style={inputStyle}>
                    <TextInput name="code" placeholder="请输入验证码" value={this.state.code} handleInputChange={this.handleInputChange} rightContent={sendCode} />
                </div>
                <div style={inputStyle}>
                    <TextInput name="newPassword" placeholder="请输入新的密码" value={this.state.newPassword} handleInputChange={this.handleInputChange} />
                </div>

                <div style={buttonStyle}>
                    <Button name="confirm" type="primary" disabled={disabled} onClick={this.handleSubmit} value="确认" />
                </div>

                <Modal show={this.state.showModal} title="通知" content="密码重置成功" actions={ [{name: '确定', handler: this.handleRetrievePasswordSuccess}] } />
            </div>
        )

      return <FormContainer previousPage={api.baseUrl + "/login"} title="找回密码" innerHtml={content} />
    }
}


export default connect()(RetrievePassword)

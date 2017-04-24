import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { requestContents, receiveCurrentUserInfo, handleError, hideLoading } from '../actions'
import api from '../api'

import FormContainer from './FormContainer'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Select from '../components/Select'
import Modal from '../components/Modal'


const REGISTER_BASIC_INFO = 'REGISTER_BASIC_INFO'

var inputStyle = {
  margin: '30px 10px',
}

var selectStyle = {
  position: 'relative',
  margin: '30px 10px',
}

var selectTextStyle = {
  borderBottom: '1px solid rgb(34, 105, 212)',
  height: '30px',
  lineHeight: '30px',
  fontSize: '16px',
  color: '#333',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

var unselectTextStyle = {
  borderBottom: '1px solid rgb(34, 105, 212)',
  height: '30px',
  lineHeight: '30px',
  fontSize: '16px',
  color: '#a9a9a9',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}


const tagContainerStyle = {
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
  height: '50%',
  zIndex: '1',
}

var showPasswordStyle = {
  padding: '5px',
}

var showPasswordIconStyle = {
  width: '20px',
  height: '20px',
  verticalAlign: 'top',
}

class Register2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        name: '',
        company: '',
        title: null, // 职位
        tags: [],
        password: '',
        showTitle: false,
        showTags: false,
        showPassword: false,
        showModal: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelectTitle = this.handleSelectTitle.bind(this)
    this.showTitleSelect = this.showTitleSelect.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.showTagsSelect = this.showTagsSelect.bind(this)
    this.togglePassword = this.togglePassword.bind(this)
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({
      [name]: value
    })
  }

  showTagsSelect() {
    this.setState({
      showTags: true
    })
  }

  showTitleSelect() {
    this.setState({
      showTitle: true
    })
  }

  handleSelectTags(ids) {
    this.setState({
      tags: ids,
      showTags: false
    })
  }

  handleSelectTitle(ids) {
    console.log(ids)
    var id = ids.length ? ids[0] : null
    this.setState({
      title: id,
      showTitle: false
    })
  }

  togglePassword(event) {
    console.log(event)
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  handleSubmit() {
    var registerBasicInfo = JSON.parse(localStorage.getItem(REGISTER_BASIC_INFO))
    var param = {
      'name': this.state.name,
      'emailAddress': registerBasicInfo.email,
      'mobile': registerBasicInfo.mobile,
      'password': this.state.password,
      'cardBucket': 'image',
      'cardKey': '',
      'gender': 0,
      'company': this.state.company,
      'titleId': this.state.title,
      'registerSource': 3,
      'userType': registerBasicInfo.userType,
      'userTagses': this.state.tags,
      'mobileAreaCode': 86,
      'countryId': 42,
      'auditStatus': 1,
    }

    this.props.dispatch(requestContents(''))
    api.createUser(
      param,
      (result) => {
        // TODO: 注册后，显示审核通知
        // '账号注册成功，工作人员会尽快审核，审核通过后可以正常使用。'
        // 等一会儿，跳转到主页
        this.props.dispatch(hideLoading())
        localStorage.removeItem('REGISTER_BASIC_INFO')
        localStorage.removeItem('VERIFICATION_CODE_TOKEN')
        this.setState({ showModal: true })
      },
      error => this.props.dispatch(handleError(error))
    )

  }

  handleSubmitSuccess() {
    this.setState({ showModal: false })
    this.props.history.push('/')
  }

  render() {
    var disabled =  this.state.name == '' ||
                    this.state.company == '' ||
                    this.state.title == null ||
                    this.state.tags.length == 0 ||
                    this.state.password == ''

    console.log(this.props)
    var titleOptions = this.props.titles.map(item => {
      return {id: item.id, name: item.titleName}
    })
    var titleText = this.state.title != null
                    ? titleOptions.filter(option => this.state.title == option.id)[0].name
                    : '请选择职位'

    var tagsOptions = this.props.tags.map(item => {
      return {id: item.id, name: item.tagName}
    })
    var tagsText = this.state.tags.length
                        ? tagsOptions.filter(option => this.state.tags.indexOf(option.id) > -1)
                                         .map(option => option.name)
                                         .join('，')
                        : '请选择关注的行业'
    
    var showPassword = 
      <div style={showPasswordStyle} onClick={this.togglePassword}>
        <img src={ this.state.showPassword ? "/images/login/eyeOpen@2x.png" : "/images/login/eyeClose@2x.png"} style={showPasswordIconStyle} alt="" />
      </div>

    var content =
      <div>

        <div style = {inputStyle}>
            <TextInput name="name" placeholder="姓名" value={this.state.name} handleInputChange={this.handleInputChange} />
        </div>

        <div style = {inputStyle}>
            <TextInput name="company" placeholder="公司名称" value={this.state.company} handleInputChange={this.handleInputChange} />
        </div>

        <div style = {selectStyle}>
            <div style = { this.state.title != null ? selectTextStyle : unselectTextStyle } onClick={this.showTitleSelect} >{ titleText || '请选择职位' }</div>

            <div style={{ display: this.state.showTitle ? 'block' : 'none' }}>
              <div style={tagContainerStyle}>
                <Select title="请选择职位" multiple={false} options={titleOptions} onConfirm={this.handleSelectTitle} />
              </div>
            </div>
        </div>

        <div style = {selectStyle}>
            <div style = { this.state.tags.length ? selectTextStyle : unselectTextStyle } onClick={this.showTagsSelect} >{ tagsText || '请选择关注的行业' }</div>

            <div style={{ display: this.state.showTags ? 'block' : 'none' }}>
              <div style={tagContainerStyle}>
                <Select title="请选择关注的行业" multiple={true} options={tagsOptions} onConfirm={this.handleSelectTags} />
              </div>
            </div>
        </div>

        <div style = {inputStyle}>
            <TextInput name="password" placeholder="请输入密码" value={this.state.password} type={this.state.showPassword ? 'text' : 'password'} handleInputChange={this.handleInputChange} rightContent={showPassword} />
        </div>

        <div>
            <Button name="register" type="primary" disabled={disabled} onClick={this.handleSubmit} value="注册" />
        </div>

        <Modal show={this.state.showModal}
               title="通知"
               content="账号注册成功，工作人员会尽快审核，审核通过后可以正常使用。"
               actions={ [{name: '确定', handler: this.handleSubmitSuccess}] }>
        </Modal>

      </div>

    return <FormContainer previousPage="/register" title="个人信息" innerHtml={content} />
  }

}

function mapStateToProps(state) {
  const tags = state.tags
  const titles = state.titles
  return {tags, titles}
}

export default connect(mapStateToProps)(Register2)

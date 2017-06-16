import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import LeftLabelRightContent from '../components/LeftLabelRightContent'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import Select from '../components/Select'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const cardStyle = {
  width: '100%'
}

const cardImageContainerStyle = {
  position: 'relative'
}

const inputStyle = {
  fontSize: '16px',
  width: '96%',
  border: 'none'
}

const tagContainerStyle = {
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
  height: '50%',
  zIndex: '1',
}

const placeholderStyle = {
  position: 'fixed',
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight + 'px',
  top: 48,
  width: '100%',
  zIndex: -1
}

class AddInvestor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name: props.location.state ?  props.location.state.name : "",
      title: props.location.state ? props.location.state.title : null,
      mobile: props.location.state ? props.location.state.mobile : "",
      email: props.location.state ? props.location.state.email : "",
      image: props.location.state ? props.location.state.image : null,
      company: props.location.state ? props.location.state.company : "",
      showTitle: false,
      file: props.location.state ? props.location.state.file : null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showTitleSelect = this.showTitleSelect.bind(this)
    this.handleSelectTitle = this.handleSelectTitle.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit() {

    if (this.state.name === '' || this.state.title === '' || this.state.mobile === '' ) {
      this.props.dispatch(handleError(new Error('content can not be empty')))
      return
    }   

    const body = {
      'name': this.state.name,
      'titleId': this.state.title,
      'emailAddress': this.state.email,
      'mobile': this.state.mobile,
      'company': this.state.company,
      'password': '123456',
      'cardBucket': 'image',
      'cardKey': null,
      'gender': 0,
      'company': null,
      'registerSource': 3,
      'userType': 1,
      'userTagses': [],
      'mobileAreaCode': 86,
      'countryId': 42,
      'auditStatus': 1,
    }

    this.props.dispatch(requestContents(''))

    let existUser
    api.checkUserExist(this.state.mobile)
      .then(user => {
        console.log('checkMobileExist', user)
        if (user) {
          existUser = user
        }
        if (this.state.email) {
          return api.checkUserExist(this.state.email)
        } else {
          return Promise.resolve("The Email is empty!")
        }
      })
      .then(user => {
        console.log('checkEmailExist', user)
        if (user instanceof Object) {
          if (existUser && existUser.id !== user.id) {
            throw new Error("mobile_or_email_possessed")
          }
          existUser = user
        }
        if (existUser) {
          return api.checkUserCommonTransaction(existUser.id)
        } else {
          return Promise.resolve("The investor is not exist in our database!")
        }
      })
      .then(relationId => {
        console.log('checkUserCommonTransaction', relationId)
        if (existUser && relationId === null) {
          return api.addUserCommonTransaction(existUser.id)
        } else {
          return Promise.resolve("The investor is not exist or the relationship has already been established!")
        }
      })
      .then(relationId => {
        console.log('addUserCommonTransaction', relationId)
        if (existUser) {
          return api.getSingleUserInfo(existUser.id)
        } else {
          return Promise.resolve("The investor is not exist in our database!")
        }
      })
      .then(userInfo => {
        console.log('getSingleUserInfo', userInfo)
        let cardKey
        if (existUser) {
          existUser = userInfo
          cardKey = existUser.cardKey
        }
        const formData = new FormData()
        formData.append('file', this.state.file)
        return api.uploadImage(formData, cardKey)
      })
      .then(data => {
        console.log('uploadCard', data)
        const cardKey = data.key
        const cardUrl = data.url
        if (existUser) {
          const userTagses = existUser.userTags.map(tag => tag.id)
          const orgId = existUser.org ? existUser.org.id : null
          const orgAreaId = existUser.orgArea ? existUser.orgArea.id : null
          const titleId = this.state.title || (existUser.title ? existUser.title.id : null)
          const emailAddress = this.state.email || existUser.emailAddress
          const company = this.state.company || existUser.company
          const name = this.state.name || existUser.name
          const mobile = this.state.mobile || existUser.mobile
          return api.updateUser(existUser.id, {...existUser, userTagses, orgId, orgAreaId, titleId, emailAddress, company, name, cardKey, cardUrl, mobile})
        } else {
          const partnerId = this.props.userInfo.id
          return api.addUser({...body, partnerId, cardKey, cardUrl})
        }
      })
      .catch(error => this.props.dispatch(handleError(error)))

    setTimeout(
      () => {
        this.props.dispatch(hideLoading())
        //this.props.history.goBack()
      },
      1000
    )
  }

  showTitleSelect() {
    this.setState({
      showTitle: true
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

  render() {

    const titleOptions = this.props.titles.map(item => {
      return {id: item.id, name: item.titleName}
    })

    const titleText = this.state.title != null && titleOptions.length > 0
      ? titleOptions.filter(option => this.state.title == option.id)[0].name
      : '点击选择职位'

    const transparentStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: window.innerHeight - 48 + 'px',
      width: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      display: this.state.showTitle ? 'block': 'none',
    }

    return (
      <div>
        <NavigationBar title="新增投资人" action="提交" onActionButtonClicked={this.handleSubmit} />

        { /* <div style={placeholderStyle} /> */ }

        <div style={containerStyle}>

          <div style={cardImageContainerStyle}>
            <img style={cardStyle} alt="" src={ this.state.image || api.baseUrl + "/images/userCenter/emptyCardImage@2x.png" } />
          </div>

          <div>
            <LeftLabelRightContent label="姓名" content={<input name="name" style={inputStyle} value={this.state.name} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="职位" content={<div style={{ fontSize: 16, width: '96%' }} onClick={this.showTitleSelect} >{ titleText }</div>} />
            <LeftLabelRightContent label="手机" content={<input name="mobile" style={inputStyle} value={this.state.mobile} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="邮箱" content={<input name="email" style={inputStyle} value={this.state.email} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="公司" content={<input name="company" style={inputStyle} value={this.state.company} onChange={this.handleInputChange} />} />
          </div>

        </div>

        <div style={transparentStyle}></div>

        <div style={{ display: this.state.showTitle ? 'block' : 'none' }}>
          <div style={tagContainerStyle}>
            <Select title="请选择职位" multiple={false} options={titleOptions} onConfirm={this.handleSelectTitle} />
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { userInfo, titles } = state
  return { userInfo, titles }
}

export default connect(mapStateToProps)(AddInvestor)

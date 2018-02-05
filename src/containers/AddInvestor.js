import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import LeftLabelRightContent from '../components/LeftLabelRightContent'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import Select from '../components/Select'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { Link } from 'react-router-dom';

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
      file: props.location.state ? props.location.state.file : null,
      tags: [],
      showChooseTagsModal: false, 
      groupOptions: [],
      group: null,
      showChooseGroupModal: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showTitleSelect = this.showTitleSelect.bind(this)
    this.handleSelectTitle = this.handleSelectTitle.bind(this)
  }

  componentDidMount() {
    newApi.queryUserGroup({ type: 'investor' })
      .then(data => this.setState({ groupOptions: data.data }));
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

    if (!this.state.name || !this.state.title || !this.state.mobile || !this.state.email || !this.state.company) {
      this.props.dispatch(handleError(new Error('content can not be empty')))
      return
    }
    
    // if (!/^1[34578]\d{9}$/.test(this.state.mobile)) {
    //   this.props.dispatch(handleError(new Error('mobile_not_valid')))
    //   return
    // }

    if(!/[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z0-9_\-\.]+/.test(this.state.email)) {
      this.props.dispatch(handleError(new Error('Please input valid Email')))
      return
    }

    const body = {
      'usernameC': this.state.name,
      'title': this.state.title,
      'email': this.state.email,
      'mobile': this.state.mobile,
      'orgname': this.state.company,
      'cardBucket': 'image',
    }

    this.props.dispatch(requestContents(''))

    let existUser
    newApi.checkUserExist(this.state.mobile)
    .then(result => {
      console.log('checkMobileExist', result)
      if (result.result) {
        existUser = result.user
      }
      if (this.state.email) {
        return newApi.checkUserExist(this.state.email)
      } else {
        return Promise.resolve("The Email is empty!")
      }
    })
    .then(result => {
      console.log('checkEmailExist', result)
      if (result instanceof Object && result.result) {
        if (existUser && existUser.id !== result.user.id) {
          throw new Error("mobile_or_email_possessed")
        }
        existUser = result.user
      }
      if (existUser) {
        return newApi.checkUserRelation(existUser.id, utils.getCurrentUserId())
      } else {
        return Promise.resolve("The investor is not exist in our database!")
      }
    })
    .then(result => {
      console.log('checkUserCommonTransaction', result)
      if (existUser && !result) {
        return newApi.addUserRelation({
          relationtype: false,
          investoruser: existUser.id,
          traderuser: utils.getCurrentUserId()
        })
      } else {
        return Promise.resolve("The investor is not exist or the relationship has already been established!")
      }
    })
    .then(result => {
      console.log('addUserCommonTransaction', result)
      if (existUser) {
        return newApi.getUserDetailLang(existUser.id)
      } else {
        return Promise.resolve("The investor is not exist in our database!")
      }
    })
    .then(result => {
      console.log('getSingleUserInfo', result, this.state.file)
      let cardKey
      if (existUser) {
        existUser = result
        cardKey = existUser.cardKey
      }
      const formData = new FormData()
      formData.append('file', this.state.file)
      return cardKey ? newApi.coverUpload(cardKey, formData, 'image') : newApi.basicUpload(formData, 'image')
    })
    .then(result => {
      console.log('uploadCard', result)
      const cardKey = result.key
      const cardUrl = result.url
      if (existUser) {
        const title = this.state.title || (existUser.title ? existUser.title.id : null)
        const email = this.state.email || existUser.email
        const orgname = this.state.company || existUser.org.id
        const usernameC = this.state.name || existUser.username
        const mobile = this.state.mobile || existUser.mobile
        return newApi.editUser([existUser.id], { orgname, title, email, usernameC, cardKey, cardUrl, mobile })
      } else {
        const partnerId = this.props.userInfo.id
        return newApi.addUser({ ...body, partnerId, cardKey, cardUrl, userstatus: 2, groups: [1] })
      }
    })
    .then(result => {
      console.log('update or add user result', result)
      if (!existUser) {
        return newApi.addUserRelation({
          relationtype: false,
          investoruser: result.id,
          traderuser: utils.getCurrentUserId()
        })
      } else {
        return Promise.resolve('the relationship has already been established')
      }
    })
    .then(data => {
      this.props.dispatch(hideLoading())
      this.props.history.goBack()
    })
    .catch(error => {
      this.props.dispatch(hideLoading())
      this.props.dispatch(handleError(error))
    })
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

  handleSelectTags = tags => {
    this.setState({
      tags,
      showChooseTagsModal: false
    })
  }

  handleSelectGroup = group => this.setState({ 
    group: group.length ? group[0] : null, 
    showChooseGroupModal: false 
  });

  render() {

    const titleOptions = this.props.titles.map(item => {
      return {id: item.id, name: item.titleName}
    })

    const titleText = this.state.title != null && titleOptions.length > 0
      ? titleOptions.filter(option => this.state.title == option.id)[0].name
      : '点击选择职位'

    const groupText = this.state.group != null && this.state.groupOptions.length > 0
      ? this.state.groupOptions.filter(option => this.state.group === option.id)[0].name
      : '点击选择角色';
    const tagOptions = this.props.tags.map(item => ({ id: item.id, name: item.tagName }));
    const tagText = this.state.tags.length > 0 ? this.state.tags.map(m => tagOptions.filter(f => f.id === m)[0].name).join(',') : '点击选择标签';

    const transparentStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: window.innerHeight - 48 + 'px',
      width: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      display: this.state.showTitle || this.state.showChooseTagsModal || this.state.showChooseGroupModal ? 'block': 'none',
    }
   
    const orgText = typeof this.state.company === 'object' && this.state.company !== null ? this.state.company.orgname : this.state.company;

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
            <LeftLabelRightContent label="角色" content={<div style={{ fontSize: 16, width: '96%' }} onClick={() => this.setState({ showChooseGroupModal: true })} >{ groupText }</div>} />
            <LeftLabelRightContent label="职位" content={<div style={{ fontSize: 16, width: '96%' }} onClick={() => this.setState({ showTitle: true })}>{ titleText }</div>} />
            <LeftLabelRightContent label="标签" content={<div style={{ fontSize: 16, width: '96%' }} onClick={() => this.setState({ showChooseTagsModal: true })} >{ tagText }</div>} />
            <LeftLabelRightContent label="手机" content={<input name="mobile" style={inputStyle} value={this.state.mobile} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="邮箱" content={<input name="email" style={inputStyle} value={this.state.email} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="机构" 
              // content={<input disabled name="company" style={inputStyle} value={this.state.company} onChange={this.handleInputChange} />} 
              content={<Link to="/select_org"><div style={{ fontSize: 16, width: '96%' }}>{ orgText }</div></Link>}
            />
          </div>

        </div>

        <div style={transparentStyle}></div>

        <div style={{ display: this.state.showTitle ? 'block' : 'none' }}>
          <div style={tagContainerStyle}>
            <Select title="请选择职位" multiple={false} options={titleOptions} onConfirm={this.handleSelectTitle} />
          </div>
        </div>

        <div style={{ display: this.state.showChooseGroupModal? 'block' : 'none' }}>
          <div style={tagContainerStyle}>
            <Select title="请选择角色" multiple={false} options={this.state.groupOptions} onConfirm={this.handleSelectGroup} />
          </div>
        </div>

        <div style={{ display: this.state.showChooseTagsModal ? 'block' : 'none' }}>
          <div style={tagContainerStyle}>
            <Select title="请选择标签" multiple options={tagOptions} onConfirm={this.handleSelectTags} />
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { userInfo, titles, tags } = state;
  return { userInfo, titles, tags };
}

export default connect(mapStateToProps)(AddInvestor)

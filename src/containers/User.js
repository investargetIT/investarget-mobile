import React, { Component } from 'react'
import TabBar from './TabBar'
import LeftIconRightLabel from '../components/LeftIconRightLabel'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { logout, handleError, requestContents, hideLoading, modifyUserInfo } from '../actions'
import api from '../api'

var blurBackgroundStyle = {
  position: 'absolute',
  width: '100%',
  height: '240px',
  zIndex: -1,
  overflow: 'hidden',
}

var blurImageStyle = {
  width: '100%',
  height: '240px',
  backgroundImage: 'url(images/userCenter/ht-usercenterheaderbg@2x.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  filter: 'blur(5px)',
  transform: 'scale(1.08)',
}

var headerContainerStyle = {
  padding: '40px',
  textAlign: 'center',
  color: 'white'
}

var avatarStyle = {
  width: '90px',
  height: '90px',
  borderRadius: '50%'
}

var orgNameStyle = {
  fontSize: '18px',
  margin: '10px'
}

var nameAndTitleStyle = {
  fontSize: '15px',
  margin: '0px 30px'
}

var settingContainerStyle = {
  padding: '20px 0px'
}

var avatarContainerStyle = {
  position: 'relative',
  display: 'inline-block'
}

var inputContainerStyle = {
  position: 'absolute',
  left: 0,
  top: 0
}

var inputStyle = {
  width: '90px',
  height: '90px',
  opacity: 0
}

class User extends Component {

  constructor(props) {
    super(props)

    this.state = { avatar: null}

    this.handleClick = this.handleClick.bind(this)

    this.handleAvatarChange = this.handleAvatarChange.bind(this)
    this.readFile = this.readFile.bind(this)
  }

  handleClick() {
    if (confirm('确定退出？')) {
      this.props.dispatch(logout())
    }
  }

  handleAvatarChange(e) {
    var file = e.target.files[0];

    if (file) {
      if (/^image\//i.test(file.type)) {
        this.readFile(file);
      } else {
        alert('Not a valid image!');
      }
    }
  }

  readFile(file) {

    var react = this
    var reader = new FileReader();

    reader.onloadend = function () {

      react.setState({ avatar: reader.result });

      var formData = new FormData()
      formData.append('file', file)
      formData.append('key', 'photoKey')

      api.uploadUserAvatar(
	formData,
	(key, url) => {
	  react.props.dispatch(hideLoading())
	  react.props.dispatch(handleError(new Error('Please wait patient')))
	  const newUserInfo = Object.assign({}, react.props.userInfo, {
	    photoKey: key,
	    photoUrl: url
	  })
	  react.props.dispatch(modifyUserInfo(newUserInfo))
	},
	error => react.props.dispatch(handleError(error)),
	react.props.userInfo.photoKey || null
      )
    }

    reader.onerror = function () {
      alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
    this.props.dispatch(requestContents(''))
  }


  render () {
    if (!this.props.isLogin) {
      return (
        <Redirect to="/login" />
      )
    }

    return (
      <div>

        <div style={blurBackgroundStyle}>
          <div style={blurImageStyle}></div>
        </div>
        <div style={headerContainerStyle}>
	  <div style={avatarContainerStyle}>
	    <img alt="" style={avatarStyle} src={this.state.avatar || this.props.userInfo.photoUrl} />
	    <div style={inputContainerStyle}><input style={inputStyle} id="file" type="file" accept="image/*" onChange={this.handleAvatarChange} /></div>
	  </div>
          <p style={orgNameStyle}>{this.props.userInfo.company}</p>
          <p><span style={nameAndTitleStyle}>{this.props.userInfo.name}</span><span style={nameAndTitleStyle}>{this.props.userInfo.title.titleName}</span></p>
        </div>

        <div style={settingContainerStyle}>
          <ul>

            <Link to="/my_investor">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-1@2x.png" label="我的投资人" />
            </Link>

            <Link to="/notification">
              <LeftIconRightLabel icon="images/notifyMessage@2x.png" label="通知消息" />
            </Link>

            <Link to="/my_tag">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-1@2x.png" label="关注的标签" />
            </Link>

            <Link to="/timeline_management">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-9@2x.png" label="时间轴管理" />
            </Link>

            <Link to="/my_favorite_project">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-3@2x.png" label="收藏的项目" />
            </Link>
            
            <Link to="/modify_password">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-5@2x.png" label="修改密码" />
            </Link>

            <Link to="/modify_business_card">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-6@2x.png" label="修改名片" />
            </Link>

            <Link to="/contact">
              <LeftIconRightLabel icon="images/userCenter/ht-usercenter-8@2x.png" label="联系我们" />
            </Link>

            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-9@2x.png" label="退出登录" onClick={this.handleClick} />

          </ul>
        </div>

        <TabBar />

      </div>
    )
  }

}

function mapStateToProps(state) {
  const isLogin = state.isLogin
  const userInfo = state.userInfo
  return { isLogin, userInfo }
}

export default connect(mapStateToProps)(User)

import React, { Component } from 'react'
import TabBar from './TabBar'
import LeftIconRightLabel from './LeftIconRightLabel'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { logout } from '../actions'

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

class User extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    if (confirm('确定退出？')) {
      this.props.dispatch(logout())
    }
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
          <img alt="" style={avatarStyle} src={this.props.userInfo.photoUrl} />
          <p style={orgNameStyle}>{this.props.userInfo.company}</p>
          <p><span style={nameAndTitleStyle}>{this.props.userInfo.name}</span><span style={nameAndTitleStyle}>{this.props.userInfo.title.titleName}</span></p>
        </div>

        <div style={settingContainerStyle}>
          <ul>
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-1@2x.png" label="关注的标签" />
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-9@2x.png" label="时间轴管理" />
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-3@2x.png" label="收藏的项目" />
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-5@2x.png" label="修改密码" />
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-6@2x.png" label="修改名片" />
            <LeftIconRightLabel icon="images/userCenter/ht-usercenter-7@2x.png" label="清除缓存" />      <LeftIconRightLabel icon="images/userCenter/ht-usercenter-8@2x.png" label="联系我们" />
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
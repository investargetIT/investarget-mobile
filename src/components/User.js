import React from 'react'
import TabBar from './TabBar'
import LeftIconRightLabel from './LeftIconRightLabel'

var blurBackgroundStyle = {
  position: 'absolute',
  width: '100%',
  height: '240px',
  backgroundImage: 'url(images/userCenter/ht-usercenterheaderbg@2x.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  filter: 'blur(5px)',
  zIndex: -1
}

var headerContainerStyle = {
  padding: '40px',
  textAlign: 'center',
  color: 'white'
}

var avatarStyle = {
  width: '90px',
  height: '90px'
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

function User(props) {
  return (
    <div>

      <div style={blurBackgroundStyle}></div>
      <div style={headerContainerStyle}>
        <img alt="" style={avatarStyle} src="images/userCenter/defaultAvatar@2x.png" />
        <p style={orgNameStyle}>海拓</p>
        <p><span style={nameAndTitleStyle}>军柯</span><span style={nameAndTitleStyle}>助理</span></p>
      </div>

      <div style={settingContainerStyle}>
        <ul>
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-1@2x.png" label="关注的标签" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-9@2x.png" label="时间轴管理" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-3@2x.png" label="收藏的项目" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-5@2x.png" label="修改密码" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-6@2x.png" label="修改名片" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-7@2x.png" label="清除缓存" />        <LeftIconRightLabel icon="images/userCenter/ht-usercenter-8@2x.png" label="联系我们" />
          <LeftIconRightLabel icon="images/userCenter/ht-usercenter-9@2x.png" label="退出登录" />
        </ul>
      </div>

      <TabBar />
    </div>
  )
}

export default User
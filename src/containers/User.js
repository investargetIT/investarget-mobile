import React, { Component } from 'react'
import TabBar from './TabBar'
import LeftIconRightLabel from '../components/LeftIconRightLabel'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { logout, handleError, requestContents, hideLoading, modifyUserInfo, saveRedirectUrl } from '../actions'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'

const inWxApp = newApi.inWxApp;

const groupStyle = {
  position: 'relative'
}
const border = {
  WebkitTransform: 'scale(0.5)',
  transform: 'scale(0.5)',
  position: 'absolute',
  borderTop: '1px solid lightGray',
  borderBottom: '1px solid lightGray',
  top: '-50%',
  right: '-50%',
  bottom: '-50%',
  left: '-50%',
}
const container = {
  position: 'relative',
  marginBottom: '16px',
  backgroundColor: 'white'
}
function Group(props) {
  return (
    <div style={container}>
      <div style={groupStyle}>{props.children}</div>
      <div style={border}></div>
    </div>
  )
}

var blurBackgroundStyle = {
  position: 'absolute',
  width: '100%',
  height: '240px',
  zIndex: -1,
  overflow: 'hidden',
  WebkitTransform: 'translate3d(0,0,0)'
}

var blurImageStyle = {
  width: '100%',
  height: '240px',
  backgroundImage: 'url(' + api.baseUrl + '/images/userCenter/ht-usercenterheaderbg@2x.png)',
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

const placeholderStyle = {
  position: 'fixed',
  backgroundColor: 'rgb(238, 243, 244)',
  minHeight: window.innerHeight - 48 + 'px',
  width: '100%',
  zIndex: -1
}

class User extends Component {

  constructor(props) {
    super(props)

    this.state = { avatar: null}

    this.handleClick = this.handleClick.bind(this)

    this.handleAvatarChange = this.handleAvatarChange.bind(this)
    this.readFile = this.readFile.bind(this)

    this.userInfo = JSON.parse(localStorage.getItem("WXUSERINFO") || "{}")
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

      newApi.qiniuUpload('image', file)
      .then(result => {
        react.props.dispatch(hideLoading())
        react.props.dispatch(handleError(new Error('Please wait patient')))

        const { key: photoKey, url: photoUrl } = result.data
        const userId = utils.getCurrentUserId()
        newApi.editUser([userId], { photoKey, photoUrl })
          .then(data => {
            const newUserInfo = { ...react.props.userInfo, photoKey, photoUrl }
            react.props.dispatch(modifyUserInfo(newUserInfo))
          })
      })
      .catch(error => {
        react.props.dispatch(handleError(error))
      })

    }
      

    reader.onerror = function () {
      alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
    this.props.dispatch(requestContents(''))
  }


  render () {
    if (!this.props.isLogin) {
      this.props.dispatch(saveRedirectUrl(this.props.location.pathname))
      return (
        <Redirect to={api.baseUrl + "/login"} />
      )
    }

    return (
      <div>

        <div style={placeholderStyle}></div>

        <div style={blurBackgroundStyle}>
          <div style={blurImageStyle}></div>
        </div>

        <div style={headerContainerStyle}>
          <div style={avatarContainerStyle}>
            <img alt="" style={avatarStyle} src={ this.userInfo.avatarUrl || this.state.avatar || this.props.userInfo.photoUrl } />
            <div style={inputContainerStyle}><input style={inputStyle} id="file" type="file" accept="image/*" onChange={this.handleAvatarChange} /></div>
          </div>
          <p style={orgNameStyle}>{this.props.userInfo.company}</p>
          <p><span style={nameAndTitleStyle}>{this.props.userInfo.name}</span><span style={nameAndTitleStyle}>{this.props.userInfo.title && this.props.userInfo.title.titleName || "暂无职位"}</span></p>
        </div>

        <div style={settingContainerStyle}>
          <ul>
            <Group>
               <Link to={api.baseUrl + "/my_partener"}>
                {
                  this.props.userInfo.userType === 1 ?
                    <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-6@2x.png"} label="我的交易师" /> :
                    <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-6@2x.png"} label="我的投资人" />
                }
              </Link>

              <Link to={api.baseUrl + "/notification"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/notification.svg"} label="通知消息" hideBorder={true} />
              </Link>
            </Group>
            <Group>
              <Link to={api.baseUrl + "/my_tag"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-1@2x.png"} label="关注的标签" />
              </Link>

              <Link to={api.baseUrl + "/timeline_management"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/timeline.svg"} label="时间轴管理" />
              </Link>

              <Link to={api.baseUrl + "/my_favorite_project"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-3@2x.png"} label="收藏的项目" hideBorder={true} />
              </Link>
            </Group>
            <Group>
              <Link to={api.baseUrl + "/modify_password"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-5@2x.png"} label="修改密码" />
              </Link>

              <Link to={api.baseUrl + "/modify_business_card"}>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/name_card@2x.png"} label="修改名片" />
              </Link>

              <Link to={api.baseUrl + "/contact"}>
		<LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-8@2x.png"} label="联系我们" hideBorder={true} />
	      </Link>
            </Group>



            {inWxApp ? null :
              <Group>
                <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-9@2x.png"} label="退出登录" onClick={this.handleClick} hideBorder={true} />
              </Group>
            }

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

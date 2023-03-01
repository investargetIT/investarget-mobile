import React, { Component } from 'react'
import TabBar from './TabBar'
import LeftIconRightLabel from '../components/LeftIconRightLabel'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { logout, handleError, requestContents, hideLoading, modifyUserInfo, saveRedirectUrl } from '../actions'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import './ChatGPT.css';


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

var settingContainerStyle = {
  padding: '20px 0px',
  paddingTop: 10,
}

class User extends Component {

  constructor(props) {
    super(props)

    this.state = {
      avatar: null,
      inputValue: '',
      allTopics: [],
    }

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

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.inputValue) return;
    const body = {
      topic_name: this.state.inputValue,
    };
    this.props.dispatch(requestContents(''));
    newApi.createChatGPTTopic(body)
      .then(res => {
        console.log('res', res);
        this.props.dispatch(hideLoading());
        this.setState({ inputValue: '', allTopics: [res].concat(this.state.allTopics) })
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
        this.props.dispatch(hideLoading());
      });
  }

  componentDidMount() {
    this.props.dispatch(requestContents(''));
    newApi.getChatGPTTopic()
      .then(res => {
        console.log('res', res);
        this.props.dispatch(hideLoading());
        this.setState({ allTopics: res.data });
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
        this.props.dispatch(hideLoading());
      });
  }

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
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

        <form onSubmit={this.handleSubmit} className="input-form" style={{ position: 'unset' }}>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            placeholder="新话题"
            className="input-field"
          />
          <button type="submit" className="send-button">
            创建
          </button>
        </form>

        <div style={settingContainerStyle}>
          <div style={{ marginLeft: 22, color: 'gray' }}>历史话题</div>
          <ul>
            <Group>
              {this.state.allTopics.map(m => (
                <Link key={m.id} to={api.baseUrl + "/chatgpt/" + m.id + "?topic_name=" + m.topic_name}>
                  <LeftIconRightLabel icon={api.baseUrl + "/images/userCenter/ht-usercenter-1@2x.png"} label={m.topic_name}/>
                </Link>
              ))}
            </Group>

          </ul>
        </div>

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

import React, { Component } from 'react'
import NewTabBar from './NewTabBar';
import AdvancedLeftIconRightLabel from '../components/AdvancedLeftIconRightLabel'
import Modal from '../components/Modal';
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
  // backgroundColor: 'white'
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
  paddingBottom: 'env(safe-area-inset-bottom)',
}

class AllDocumentTopics extends Component {

  constructor(props) {
    super(props)

    this.state = {
      avatar: null,
      inputValue: '',
      allTopics: [],
      showModal: false,
      toDeleteTopicID: null,
    }

    this.handleClick = this.handleClick.bind(this)

    // this.handleAvatarChange = this.handleAvatarChange.bind(this)
    // this.readFile = this.readFile.bind(this)

    this.userInfo = JSON.parse(localStorage.getItem("WXUSERINFO") || "{}")
  }

  handleClick() {
    if (confirm('确定退出？')) {
      this.props.dispatch(logout())
    }
  }

  // handleAvatarChange(e) {
  //   var file = e.target.files[0];

  //   if (file) {
  //     if (/^image\//i.test(file.type)) {
  //       this.readFile(file);
  //     } else {
  //       alert('Not a valid image!');
  //     }
  //   }
  // }

  // readFile(file) {

  //   var react = this
  //   var reader = new FileReader();

  //   reader.onloadend = function () {

  //     react.setState({ avatar: reader.result });

  //     newApi.qiniuUpload('image', file)
  //     .then(result => {
  //       react.props.dispatch(hideLoading())
  //       react.props.dispatch(handleError(new Error('Please wait patient')))

  //       const { key: photoKey, url: photoUrl } = result.data
  //       const userId = utils.getCurrentUserId()
  //       newApi.editUser([userId], { photoKey, photoUrl })
  //         .then(data => {
  //           const newUserInfo = { ...react.props.userInfo, photoKey, photoUrl }
  //           react.props.dispatch(modifyUserInfo(newUserInfo))
  //         })
  //     })
  //     .catch(error => {
  //       react.props.dispatch(handleError(error))
  //     })

  //   }
      

  //   reader.onerror = function () {
  //     alert('There was an error reading the file!');
  //   }

  //   reader.readAsDataURL(file);
  //   this.props.dispatch(requestContents(''))
  // }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.inputValue) return;
    const body = {
      topic_name: this.state.inputValue,
      type: 3, // ChatGPT 类型为 1，Midjourney 类型为 2, zilliz 类型为 3，pdffile chat 类型为 4
    };
    this.props.dispatch(requestContents(''));
    newApi.createChatGPTTopic(body)
      .then(res => {
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
    utils.requestAllData(newApi.getChatGPTTopic, { type: 3 }, 10)
      .then(res => {
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

  handleDeleteBtnClicked = topicID => {
    this.setState({
      showModal: true,
      toDeleteTopicID: topicID,
    });
  }

  handleConfirmBtnClicked = () => {
    this.props.dispatch(requestContents(''));
    newApi.deleteChatGPTTopic(this.state.toDeleteTopicID)
      .then(res => {
        const newTopics = this.state.allTopics.filter(f => f.id !== this.state.toDeleteTopicID);
        this.setState({ allTopics: newTopics, showModal: false, toDeleteTopicID: null });
        this.props.dispatch(hideLoading());
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
        this.props.dispatch(hideLoading());
      });
  }

  handleCancelBtnClicked = () => {
    this.setState({
      showModal: false,
      toDeleteTopicID: null,
    });
  }

  handleUpdateTopic = (topicID, topicName) => {
    const body = {
      topic_name: topicName,
      type: 3,
    };
    this.props.dispatch(requestContents(''));
    newApi.updateChatGPTTopic(topicID, body)
      .then(res => {
        const newTopics = this.state.allTopics.map(m => {
          if (m.id === topicID) {
            return res;
          }
          return m;
        });
        this.setState({ allTopics: newTopics });
        this.props.dispatch(hideLoading());
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
        this.props.dispatch(hideLoading());
      });
  }


  handleTopicClicked = (topicID, topicName) => {
    this.props.history.push("/chatfile/" + topicID + "?topic_name=" + topicName);
  }

  render () {
    if (!this.props.isLogin) {
      this.props.dispatch(saveRedirectUrl(this.props.location.pathname))
      return (
        <Redirect to={api.baseUrl + "/login"} />
      )
    }

    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'rgb(29, 30, 32)'  }}>

        <form onSubmit={this.handleSubmit} className="input-form" style={{ position: 'unset', display: 'flex' }}>
          <input
            style={{ padding: 8 }}
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            placeholder="新文档话题"
            className="input-field"
          />
          <button type="submit" className="send-button" style={{ padding: 8 }}>
            创建
          </button>
        </form>

        <div style={settingContainerStyle}>
          <ul>
              {this.state.allTopics.map((m, idx) => (
                // <Link key={m.id} to={api.baseUrl + "/chatgpt/" + m.id + "?topic_name=" + m.topic_name}>
                  <AdvancedLeftIconRightLabel
                    key={idx}
                    icon={api.baseUrl + "/images/userCenter/ht-usercenter-1@2x.png"}
                    label={m.topic_name}
                    topicID={m.id}
                    onDelete={this.handleDeleteBtnClicked}
                    onClick={this.handleTopicClicked}
                    onUpdateTopic={this.handleUpdateTopic}
                  />
                // </Link>
              ))}
          </ul>
        </div>

        <NewTabBar />

        <Modal
          show={this.state.showModal}
          title="确认删除该话题？"
          actions={[
            { name: '确认', handler: this.handleConfirmBtnClicked },
            { name: '取消', handler: this.handleCancelBtnClicked }
          ]}
        />

      </div>
    )
  }

}

function mapStateToProps(state) {
  const isLogin = state.isLogin
  const userInfo = state.userInfo
  return { isLogin, userInfo }
}

export default connect(mapStateToProps)(AllDocumentTopics)

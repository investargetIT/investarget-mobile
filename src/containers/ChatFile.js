import React, { Component } from 'react';
import './ChatGPT.css';
import * as newApi from '../api3.0';
import { connect } from 'react-redux';
import { handleError, requestContents, hideLoading } from '../actions';
import { isJsonString, requestAllData } from '../utils';
import qs from 'qs';
import NavigationBarForChatGPT from '../components/NavigationBarForChatGPT';
import { ApiError } from '../request';

const iconStyle = {
  width: 24
}

const avatarContainerStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 6,
}

const inputContainerStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const inputStyle = {
  width: '100%',
  height: '100%',
  opacity: 0
}

class ChatFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: '',
      virtualKeyboard: false,
      file: null,
      fileKey: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.topicID = this.props.match.params.id;
    this.topicName = qs.parse(this.props.location.search.slice(1)).topic_name;
    this.textareaRef = null;
  }

  componentDidMount() {
    const params = {
      topic_id: this.topicID,
    };
    this.props.dispatch(requestContents(''));
    requestAllData(newApi.getFileChatHistory, params, 100)
      .then(res => {
        const allMessages = res.data.sort((a, b) => new Date(a.msgtime) - new Date(b.msgtime))
          .reduce((prev, curr) => {
            const userAvatarUrl = this.props.userInfo.photoUrl;
            const userMessage = curr.user_content;
            const user = { message: userMessage, avatarUrl: userAvatarUrl, fileKey: curr.file_key };
            const aiAvatarUrl = '/images/logo.jpg';
            const aiMessage = curr.ai_content;
            const ai = { message: aiMessage, avatarUrl: aiAvatarUrl };
            return [...prev, user, ai].filter(f => f.message);
          }, []);
        this.setState({
          messages: allMessages,
        });
        return Promise.all(allMessages.map(async m => {
          if (m.fileKey) {
            const fileurl = await newApi.downloadUrl('file', m.fileKey);
            return { ...m, fileurl };
          }
          return m;
        }));
      })
      .then(msg => {
        const newMessage = msg.map(m => {
          let message = m.message;
          if (m.fileurl) {
            message = `<a href=${m.fileurl}><div style="display: flex;align-items: center; color: #333"><img style="width: 20px" src="/images/document.svg" />${message}</div></a>`;
          }
          return { ...m, message };
        });
        this.setState({ messages: newMessage });
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
      })
      .finally(() => {
        this.props.dispatch(hideLoading());
      });
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
    const lineHeight = 24; // You can adjust this to match your CSS line-height
    this.textareaRef.style.height = 0; // Reset height to caculate actual scroll height
    let currentRows = Math.floor(event.target.scrollHeight / lineHeight);
    if (currentRows > 10) {
      currentRows = 10; // Max 10 rows
    }
    this.textareaRef.style.height = `${currentRows * lineHeight + 20}px`;
  }

  handleUploadFileChange = e => {
    var file = e.target.files[0];

    this.setState({ file });

    // if (file) {
    //   if (/^image\//i.test(file.type)) {
    //     this.readFile(file);
    //   } else {
    //     alert('Not a valid image!');
    //   }
    // }
  }

  handleSubmit(event) {
    // newApi.deleteMessageWithChatGPT('64016b47a6ac015ad8772bfb');
    event.preventDefault();
    if (!this.state.inputValue) return;
    if (this.state.file) {
      const newMessage1 = {
        message: this.state.file.name,
        avatarUrl: this.props.userInfo.photoUrl,
      };
      const newMessage2 = {
        message: this.state.inputValue,
        avatarUrl: this.props.userInfo.photoUrl,
      };
      this.setState({
        messages: [...this.state.messages, newMessage1, newMessage2],
        inputValue: '',
        file: null,
      }, () => window.scrollTo({ top: document.body.scrollHeight }));
      this.textareaRef.style.height = 'unset'; // Reset height
      this.uploadFileAndAskQuestion(this.state.inputValue);
    } else if (this.state.fileKey) {
      const newMessage = {
        message: this.state.inputValue,
        avatarUrl: this.props.userInfo.photoUrl,
      };
      this.setState({
        messages: [...this.state.messages, newMessage],
        inputValue: '',
      });
      this.textareaRef.style.height = 'unset'; // Reset height
      const body = {
        question: this.state.inputValue,
        file_key: this.state.fileKey,
        topic_id: this.topicID,
      };
      this.props.dispatch(requestContents(''));
      newApi.getMessageWithSingleFile(body)
        .then(data => {
          const replyMessage = {
            message: data.result.trim(),
            avatarUrl: '/images/logo.jpg',
          };
          this.setState({
            messages: [...this.state.messages, replyMessage],
            inputValue: '',
          }, () => window.scrollTo({ top: document.body.scrollHeight }));
          this.props.dispatch(hideLoading());
        })
        .catch(error => {
          this.props.dispatch(handleError(error));
          this.props.dispatch(hideLoading());
        });
    } else {
      const newMessage = {
        message: this.state.inputValue,
        avatarUrl: this.props.userInfo.photoUrl,
      };
      this.setState({
        messages: [...this.state.messages, newMessage],
        inputValue: '',
      });
      this.textareaRef.style.height = 'unset'; // Reset height
      const body = {
        question: this.state.inputValue,
        topic_id: this.topicID,
      };
      this.props.dispatch(requestContents(''));
      newApi.getMessageWithChatGPTFile(body)
        .then(res => {
          const replyMessage = {
            message: res.result.answer.trim(),
            avatarUrl: '/images/logo.jpg',
          };
          this.setState({
            messages: [...this.state.messages, replyMessage],
            inputValue: '',
          }, () => window.scrollTo({ top: document.body.scrollHeight }));
          this.props.dispatch(hideLoading());
        })
        .catch(error => {
          this.props.dispatch(handleError(error));
          this.props.dispatch(hideLoading());
        });
    }
  }

  uploadFileAndAskQuestion = question => {
    this.props.dispatch(requestContents(''));
    newApi.chatGPTUpload(this.state.file, this.topicID)
      .then(result => {
        if (result.success) {
          const fileKey = result.result;
          this.setState({ fileKey });
          return newApi.getMessageWithSingleFile({ question, file_key: fileKey, topic_id: this.topicID });
        } else {
          throw new ApiError('third_party_api_error', result.errmsg);
        }
      })
      .then(data => {
        if (data.success) {
          const replyMessage = {
            message: data.result.trim(),
            avatarUrl: '/images/logo.jpg',
          };
          this.setState({
            messages: [...this.state.messages, replyMessage],
          }, () => window.scrollTo({ top: document.body.scrollHeight }));
        } else {
          throw new ApiError('third_party_api_error', data.errmsg);
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
      })
      .finally(() => {
        this.props.dispatch(hideLoading());
      });
  }

  handleInputOnFocus = () => {
    this.setState({ virtualKeyboard: true });
  }

  handleInputOnBlur = () => {
    this.setState({ virtualKeyboard: false });
  }

  handleMessageScroll = e => {
    e.target.preventDefault();
  }

  render() {
    return (
      <div className="chat-container" ref="messageContainer">
        <NavigationBarForChatGPT title={this.topicName} />
        <div className="messages" onScroll={this.handleMessageScroll} style={{ paddingBottom: this.state.virtualKeyboard ? 0 : 'env(safe-area-inset-bottom)' }}>
          {this.state.messages.map((message, index) => (
            <div key={index} className="message-container">
              <img
                src={message.avatarUrl}
                alt="Avatar"
                className="message-avatar"
              />
              <div className="message" dangerouslySetInnerHTML={{ __html: message.message }} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, color: 'lightGray' }}>{this.state.messages.length === 0 ? 'Start chatting with me!' : 'Bottom of the conversation!'}</div>
        </div>
        <form onSubmit={this.handleSubmit} className="input-form" style={{ paddingBottom: this.state.virtualKeyboard ? 10 : 'calc(10px + env(safe-area-inset-bottom)' }}>
          {this.state.file && <div style={{ color: 'white', paddingBottom: 10 }}>{this.state.file.name}</div>}
          <div className="form-container" style={{ position: 'relative' }}>
            <div style={avatarContainerStyle}>
              <img style={iconStyle} src="/images/plus.png" alt="" />
              <div style={inputContainerStyle}>
                <input style={inputStyle} id="file" name="upfile" type="file" onChange={this.handleUploadFileChange} />
              </div>
            </div>
            <textarea
              ref={el => this.textareaRef = el}
              style={{ width: '100%', padding: 10, paddingRight: 44, paddingLeft: 6 }}
              rows={1}
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              onFocus={this.handleInputOnFocus}
              onBlur={this.handleInputOnBlur}
              placeholder="在这儿输入您的问题"
              className="input-field"
            />
            <button type="submit" className="send-button" style={{ position: 'absolute', right: 10, bottom: 10 }}>
              发送
            </button>
          </div>
        </form>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const isLogin = state.isLogin
  const userInfo = state.userInfo
  return { isLogin, userInfo }
}
export default connect(mapStateToProps)(ChatFile);

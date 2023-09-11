import React, { Component } from 'react';
import './ChatGPT.css';
import * as newApi from '../api3.0';
import { connect } from 'react-redux';
import { handleError, requestContents, hideLoading } from '../actions';
import { isJsonString, requestAllData } from '../utils';
import qs from 'qs';
import NavigationBarForChatGPT from '../components/NavigationBarForChatGPT';

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

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: '',
      virtualKeyboard: false,
      file: null,
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
    requestAllData(newApi.getMessageWithChatGPT, params, 100)
      .then(res => {
        let allMessages = res.data.sort((a, b) => new Date(a.msgtime) - new Date(b.msgtime))
          .filter(f => !(f.isAI && !isJsonString(f.content)))
          .map(m => {
            let message = '';
            let avatarUrl = '/images/logo.jpg';
            if (m.isAI) {
              let reply = JSON.parse(m.content);
              message = reply.content.trim();
            } else {
              const match = JSON.parse(m.content);
              message = match[0].content;
              avatarUrl = this.props.userInfo.photoUrl;
            }
            return { ...m, message, avatarUrl };
          });
        this.setState({
          messages: allMessages,
        });
        this.props.dispatch(hideLoading());
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
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
    if (this.state.inputValue !== '' && this.state.file == null) {
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
        topic_id: this.topicID,
        // prompt: this.state.inputValue,
        messages: [{
          role: 'user',
          content: this.state.inputValue,
        }],
      };
      this.props.dispatch(requestContents(''));
      newApi.postMessageToChatGPT(body)
        .then(res => {
          const replyMessage = {
            message: res.content.trim(),
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
    } else if (this.state.inputValue !== '' && this.state.file !== null) {
      this.uploadFileAndAskQuestion(this.state.inputValue);
    }
  }

  uploadFileAndAskQuestion = question => {
    console.log('question', question);
    console.log('file', this.state.file);
    // return;
    this.props.dispatch(requestContents(''));
    newApi.chatGPTUpload(this.state.file)
      .then(result => {
        console.log('result', result);
        this.setState({ file: null });
        return newApi.getMessageWithChatGPTFile({ question });
      })
      .then(data => {
        console.log('data', data);
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
              <div className="message">{message.message}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, color: 'lightGray' }}>{this.state.messages.length === 0 ? 'Start chatting with me!' : 'Bottom of the conversation!'}</div>
        </div>
        <form onSubmit={this.handleSubmit} className="input-form" style={{ paddingBottom: this.state.virtualKeyboard ? 10 : 'calc(10px + env(safe-area-inset-bottom)' }}>
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
export default connect(mapStateToProps)(ChatApp);

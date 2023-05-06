import React, { Component } from 'react';
import './Midjourney.css';
import * as newApi from '../api3.0';
import { connect } from 'react-redux';
import { handleError, requestContents, hideLoading } from '../actions';
import { isJsonString, requestAllData } from '../utils';
import qs from 'qs';
import NavigationBarForChatGPT from '../components/NavigationBarForChatGPT';

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: '',
      virtualKeyboard: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.topicID = this.props.match.params.id;
    console.log('topic id', this.topicID);
    this.topicName = qs.parse(this.props.location.search.slice(1)).topic_name;
    console.log('topic name', this.topicName);
    this.textareaRef = null;
  }

  componentDidMount() {
    const params = {
      topic_id: this.topicID,
    };
    this.props.dispatch(requestContents(''));
    requestAllData(newApi.getMessageWithMidjourney, params, 100)
      .then(res => {
        console.log('res', res);
        let allMessages = res.data.sort((a, b) => new Date(a.promtime) - new Date(b.promtime))
          // .filter(f => !(f.isAI && !isJsonString(f.content)))
          .map(m => {
            const userMsg = {
              type: 'prompt',
              message: m.prompt,
              avatarUrl: this.props.userInfo.photoUrl,
            };
            const midjourneyMsg = {
              type: 'midjourney',
              message: 'https://learnopencv.com/wp-content/uploads/2023/02/midjourney_prompt_a_women_staring_straight_into_the_camera_with_cinemati_7efca518-91c9-4269-b73f-6af1ea619174.png',
              avatarUrl: '/images/logo.jpg',
            };
            return [userMsg, midjourneyMsg];
          })
          .reduce((prev, curr) => curr.concat(prev), []);
        console.log('all messages', allMessages);
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

  handleSubmit(event) {
    // newApi.deleteMessageWithChatGPT('64016b47a6ac015ad8772bfb');
    event.preventDefault();    
    if (this.state.inputValue !== '') {
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
        prompt: this.state.inputValue,
      };
      this.props.dispatch(requestContents(''));
      newApi.postMessageToMidjourney(body)
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
    }
  }

  handleInputOnFocus = () => {
    console.log('focus');
    this.setState({ virtualKeyboard: true });
  }

  handleInputOnBlur = () => {
    console.log('blur');
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
          {this.state.messages.map((message, index) => message.type === 'prompt' ? (
            <div key={index} className="message-container">
              <img
                src={message.avatarUrl}
                alt="Avatar"
                className="message-avatar"
              />
              <div className="message">{message.message}</div>
            </div>
          ) : (
            <div key={index} className="message-container">
              <img
                src={message.avatarUrl}
                alt="Avatar"
                className="message-avatar"
              />
             <img className="message-pic" src={message.message} style={{ width: 72 }} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, color: 'lightGray' }}>{this.state.messages.length === 0 ? 'Start generating pictures with me!' : 'Bottom of the conversation!'}</div>
        </div>
        <form onSubmit={this.handleSubmit} className="input-form" style={{ paddingBottom: this.state.virtualKeyboard ? 10 : 'calc(10px + env(safe-area-inset-bottom)' }}>
          <div className="form-container" style={{ position: 'relative' }}>
            <textarea
              ref={el => this.textareaRef = el}
              style={{ width: '100%', padding: 10, paddingRight: 44 }}
              rows={1}
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              onFocus={this.handleInputOnFocus}
              onBlur={this.handleInputOnBlur}
              placeholder="在这儿输入图片提示"
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

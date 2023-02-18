import React, { Component } from 'react';
import './ChatGPT.css';
import * as newApi from '../api3.0';
import { connect } from 'react-redux';
import { handleError } from '../actions';

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    newApi.getMessageWithChatGPT()
      .then(res => {
        console.log('res', res);
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      });
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit(event) {
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
      const body = {
        prompt: this.state.inputValue,
        max_tokens: 100,
      };
      newApi.postMessageToChatGPT(body)
        .then(res => {
          console.log('res', res);
          const reply = JSON.parse(res);
          console.log('reply', reply);

          const replyMessage = {
            message: reply.choices[0].text,
            avatarUrl: '/images/page_logo.png',
          };
          this.setState({
            messages: [...this.state.messages, replyMessage],
            inputValue: '',
          });

        })
        .catch(error => {
          this.props.dispatch(handleError(error))
        });
    }
  }

  render() {
    return (
      <div className="chat-container">
        <div className="header">
          <div className="header-text">Chat App</div>
        </div>
        <div className="messages">
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
        </div>
        <form onSubmit={this.handleSubmit} className="input-form">
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            placeholder="Type your message here"
            className="input-field"
          />
          <button type="submit" className="send-button">
            Send
          </button>
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

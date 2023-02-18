import React, { Component } from 'react';
import './ChatGPT.css';

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

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.inputValue !== '') {
      const newMessage = {
        message: this.state.inputValue,
        avatarUrl: 'https://i.pravatar.cc/50',
      };
      this.setState({
        messages: [...this.state.messages, newMessage],
        inputValue: '',
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

export default ChatApp;

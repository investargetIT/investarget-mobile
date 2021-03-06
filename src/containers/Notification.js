import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { connect } from 'react-redux'

const messageContainerStyle = {
  padding: '10px'
}

const messageIconContainerStyle = {
  float: 'left',
  width: '10%'
}

const messageIconStyle = {
  width: '24px'
}

const messageTitleStyle = {
  float: 'left',
  fontSize: '15px',
  color: '#333333'
}

const messageDateStyle = {
  float: 'right',
  fontSize: '13px',
}

const messageTitleAndDateContainerStyle = {
  overflow: 'auto',
  marginBottom: '10px'
}

const messageRightContainerStyle = {
  width: '90%',
  marginLeft: '10%',
  color: 'gray',
  fontSize: '13px'
}

function Message(props) {
  return (
    <div style={messageContainerStyle}>

      <div style={messageIconContainerStyle}>
        <img style={messageIconStyle} src={api.baseUrl + "/images/ht-notify@2x.png"} alt="" />
      </div>

      <div style={messageRightContainerStyle}>
        <div style={messageTitleAndDateContainerStyle}>
          <div style={messageTitleStyle}>{props.title}</div>
          <div style={messageDateStyle}>{props.date}</div>
        </div>
        <div>{props.content}</div>
      </div>

    </div>
  )
}

const filterContainerStyle = {
  width: '50%',
  margin: '6px auto',
  backgroundColor: '#286CD0',
  textAlign: 'center',
  border: '1px solid #286CD0',
  borderRadius: '20px'
}

const filterNormalStyle = {
  width: '50%',
  height: '34px',
  color: 'white',
  backgroundColor: '#286CD0',
  border: 'none',
  fontSize: '14px',
  borderRadius: '20px'
}

const filterActiveStyle = Object.assign({}, filterNormalStyle, {
  backgroundColor: 'white',
  color: '#286CD0',
})

class Notification extends Component {

  constructor(props) {
    super(props)

    this.state = { 
      showUnReadMessage: false,
      message: []
    }

    this.handleFilterTypeChanged = this.handleFilterTypeChanged.bind(this)
    this.handleMessageClicked = this.handleMessageClicked.bind(this)
  }

  componentDidMount() {
    this.getMessage(!this.state.showUnReadMessage)
  }

  getMessage = (isRead) => {
    const param = {
      page_size: 100,
      page_index: 1,
      isRead,
    }
    newApi.getMsg(param)
      .then(data => {
        const message = data.data.map(item => utils.convertMessage(item))
        this.setState({ message })
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleFilterTypeChanged(event) {
    if (event.target.name === 'read') {
      this.setState({showUnReadMessage: false})
      this.getMessage(true)
    } else if (event.target.name === 'unread') {
      this.setState({showUnReadMessage: true})
      this.getMessage(false)
    }
  }

  getMessageTitle(type) {
    var title = ''
    switch (type) {
      case 1:
	title = '用户消息'
	break
      case 2:
	title = '项目消息'
	break
      case 3:
	title = '需求消息'
	break
      case 4:
	title = '系统消息'
	break
      case 5:
	title = '项目消息'
	break
      default:
	title = '消息'
    }
    return title
  }

  handleMessageClicked(data) {

    if (!data.isread) {
      newApi.readMsg(data.id)
    }

    // TODO 后面完善
    // if (data.messageType === 2) {
    //   window.location.href = api.baseUrl + '/project/' + data.businessId + (this.props.userInfo ? '?token=' + this.props.userInfo.token : '')
    // } else {
      let state = { content: data.content }
      this.props.history.push(api.baseUrl + '/notifications/' + data.tid, state)
    // }

  }

  render() {

    const content = this.state.message.filter(item =>
      item.isread === !this.state.showUnReadMessage
    ).map(item => <div key={item.id} onClick={this.handleMessageClicked.bind(this, item)}>
	      <Message title={this.getMessageTitle(item.messageType)} date={item.creationTime && item.creationTime.substr(0, 10)} content={item.title} />
      </div>
    )

    return (
      <div>
        <NavigationBar title="通知" />

        <div style={filterContainerStyle}>
          <button name="read" style={this.state.showUnReadMessage ? filterNormalStyle : filterActiveStyle} onClick={this.handleFilterTypeChanged}>已读</button>
          <button name="unread" style={!this.state.showUnReadMessage ? filterNormalStyle : filterActiveStyle} onClick={this.handleFilterTypeChanged}>未读</button>
        </div>

        {content}

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { userInfo } = state
  return { userInfo }
}

export default connect(mapStateToProps)(Notification)

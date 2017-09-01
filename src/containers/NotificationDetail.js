import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'

const contentStyle = {
  padding: '10px',
  lineHeight: '24px'
}

class NotificationDetail extends Component {

  constructor(props) {
    super(props)
    const { content } = props.location.state
    this.state = { content }
  }

  render() {
    return (
      <div>
	<NavigationBar title="消息详情" />
	<div style={contentStyle}>{this.state.content}</div>
      </div>
    )
  }

}

export default NotificationDetail

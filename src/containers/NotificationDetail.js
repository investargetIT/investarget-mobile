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
    this.state = { content: '' }
  }

  componentDidMount() {
    api.getNotificationDetail(
      this.props.match.params.id,
      data => this.setState({ content: data }),
      error => console.error(error)
    )
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

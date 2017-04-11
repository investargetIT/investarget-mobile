import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'

class Notification extends Component {
  render() {
    return <NavigationBar title="通知" backIconClicked={this.props.history.goBack} />
  }
}

export default Notification
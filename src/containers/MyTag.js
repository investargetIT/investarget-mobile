import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'

class MyTag extends Component {

  render() {
    return <NavigationBar title="关注标签" backIconClicked={this.props.history.goBack} />
  }

}

export default MyTag
import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'

class MyInvestor extends Component {

  render() {
    return <NavigationBar title="我的投资人" backIconClicked={this.props.history.goBack} />
  }

}

export default MyInvestor
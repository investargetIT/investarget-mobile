import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'

class MyFavoriteProject extends Component {

  render() {
    return <NavigationBar title="我收藏的项目" backIconClicked={this.props.history.goBack} />
  }

}

export default MyFavoriteProject
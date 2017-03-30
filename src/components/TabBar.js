import React, { Component } from 'react'
import TabBarItem from './TabBarItem'
import { connect } from 'react-redux'

var style = {
  padding: '3px',
  height: '48px',
  display: 'flex',
  width: '100%',
  backgroundColor: '#F7F7FA',
  position: 'fixed',
  bottom: 0,
  borderTop: '1px solid #c0bfc4',
  zIndex: 99
}

class TabBar extends Component {
  
  render() {
    return (
        <div className="tab-bar" style={style}>
          <TabBarItem label="首页" route="/" />
          <TabBarItem label="智库" route="/posts" />
          <TabBarItem label="活动" url={this.props.eventUrl} />
          <TabBarItem label="个人中心" route="/user" />
        </div>
    )
  }
}

function mapStateToProps(state) {
  const eventUrl = state.eventUrl
  return { eventUrl }
}

export default connect(mapStateToProps)(TabBar)

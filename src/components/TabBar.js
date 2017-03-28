import React, { Component } from 'react'
import TabBarItem from './TabBarItem'

var container = {
  height: '50px'
}

var style = {
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
      <div style={container}>
        <div className="tab-bar" style={style}>
          <TabBarItem label="首页" route="/" />
          <TabBarItem label="智库" route="/posts" />
          <TabBarItem label="活动" route="/events" />
          <TabBarItem label="个人中心" route="/user" />
        </div>
      </div>
    )
  }
}

export default TabBar;

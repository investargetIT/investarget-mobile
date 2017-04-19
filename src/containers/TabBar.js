import React, { Component } from 'react'
import TabBarItem from '../components/TabBarItem'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'

const containerStyle = {
  height: '48px'
}

var style = {
  padding: '6px',
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
      <div style={containerStyle}>
        <div className="tab-bar" style={style}>
	  <TabBarItem label="首页" route="/" iconSrc={ this.props.location.pathname === "/" ? "/images/userCenter/ht-usercenter-1@2x.png" : "/images/userCenter/ht-usercenter-2@2x.png"} />
          <TabBarItem label="智库" route="/posts" iconSrc={ this.props.location.pathname === "/posts" ? "/images/userCenter/ht-usercenter-1@2x.png" : "/images/userCenter/ht-usercenter-2@2x.png"} />
	  <TabBarItem label="活动" url={this.props.eventUrl} iconSrc="/images/userCenter/ht-usercenter-2@2x.png" />
          <TabBarItem label="个人中心" route="/user" iconSrc={ this.props.location.pathname === "/user" ? "/images/userCenter/ht-usercenter-1@2x.png" : "/images/userCenter/ht-usercenter-2@2x.png"} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const eventUrl = state.eventUrl
  return { eventUrl }
}

export default withRouter(connect(mapStateToProps)(TabBar))

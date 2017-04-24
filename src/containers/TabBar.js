import React, { Component } from 'react'
import TabBarItem from '../components/TabBarItem'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'
import api from '../api'

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
	  <TabBarItem label="首页" route="/" isActive={this.props.location.pathname === "/"} iconSrc={ api.baseUrl + (this.props.location.pathname === "/" ? "/images/tabbar/home_fill.png" : "/images/tabbar/home.png")} />
	  <TabBarItem label="智库" route="/posts" isActive={this.props.location.pathname === "/posts"} iconSrc={ api.baseUrl + (this.props.location.pathname === "/posts" ? "/images/tabbar/creative_fill.png" : "/images/tabbar/creative.png")} />
	  <TabBarItem label="活动" url={this.props.eventUrl} iconSrc={api.baseUrl + "/images/tabbar/activity.png"} />
	  <TabBarItem label="个人中心" route="/user" isActive={this.props.location.pathname === "/user"} iconSrc={ api.baseUrl + (this.props.location.pathname === "/user" ? "/images/tabbar/my_fill.png" : "/images/tabbar/my.png")} />
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

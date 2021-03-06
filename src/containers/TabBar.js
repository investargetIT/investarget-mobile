import React, { Component } from 'react'
import TabBarItem from '../components/TabBarItem'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'
import api from '../api'
import * as newApi from '../api3.0.js'

const inWxApp = newApi.inWxApp;

const containerStyle = {
  height: '48px',
  display: inWxApp && window.wx ? 'none' : 'flex', 
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
        <div className="tab-bar" style={{...style, display: 'flex'}}>
	  <TabBarItem label="首页" route={api.baseUrl + "/"} isActive={this.props.location.pathname === (api.baseUrl + "/")} iconSrc={ api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/") ? "/images/tabbar/home_fill.png" : "/images/tabbar/home.png")} />
	  <TabBarItem label="智库" route={api.baseUrl + "/posts"} isActive={this.props.location.pathname === (api.baseUrl + "/posts")} iconSrc={ api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/posts") ? "/images/tabbar/creative_fill.png" : "/images/tabbar/creative.png")} />
	  {/* <TabBarItem label="案例" url={this.props.eventUrl} iconSrc={api.baseUrl + "/images/tabbar/activity.png"} /> */}
    <TabBarItem label="案例" route={api.baseUrl + "/activities"} isActive={this.props.location.pathname === (api.baseUrl + "/activities")} iconSrc={ api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/activities") ? "/images/tabbar/activity_fill.png" : "/images/tabbar/activity.png")} />
	  <TabBarItem label="个人中心" route={api.baseUrl + "/user"} isActive={this.props.location.pathname === (api.baseUrl + "/user")} iconSrc={ api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/user") ? "/images/tabbar/my_fill.png" : "/images/tabbar/my.png")} />
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

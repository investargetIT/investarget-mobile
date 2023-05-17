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
  display: 'flex',
}

var style = {
  padding: '6px',
  // height: '48px',
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
        <div className="tab-bar" style={{ ...style, display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <TabBarItem label="聊天" route={api.baseUrl + "/allchats"} isActive={this.props.location.pathname === (api.baseUrl + "/allchats")} iconSrc={api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/allchats") ? "/images/tabbar/news_hot_fill.png" : "/images/tabbar/news_hot.png")} />
          <TabBarItem label="图片" route={api.baseUrl + "/allpics"} isActive={this.props.location.pathname === (api.baseUrl + "/allpics")} iconSrc={api.baseUrl + (this.props.location.pathname === (api.baseUrl + "/allpics") ? "/images/tabbar/creative_fill.png" : "/images/tabbar/creative.png")} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const eventUrl = state.eventUrl
  return { eventUrl }
}

export default withRouter(connect(mapStateToProps)(TabBar))

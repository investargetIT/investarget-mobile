import React from 'react'
import { withRouter } from 'react-router-dom'

const containerStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  height: '48px',
  width: '100%',
  backgroundColor: '#10458F',
  zIndex: 99
}

var backIconStyle = {
  position: 'absolute',
  top: '16px',
  left: '18px',
  width: '9px',
  height: '15px'
}

var titleStyle = {
  textAlign: 'center',
  fontSize: '18px',
  color: 'white',
  lineHeight: '48px'
}

const navigationBarPlaceholderStyle = {
    width: '100%',
    height: '48px',
    backgroundColor: '#303133'
}

const NavigationBar = (props) => {
  return (
    <div>

      <div style={navigationBarPlaceholderStyle}></div>

      <div style={containerStyle}>
        <img style={backIconStyle} src="/images/login/backButton@3x.png" alt="Back" onClick={props.history.goBack} />
        <div style={titleStyle}>{props.title}</div>
      </div>

    </div>
  )
}

export default withRouter(NavigationBar)
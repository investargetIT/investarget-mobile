import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'

const containerStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  width: '100%',
  backgroundColor: 'rgb(46, 47, 56)',
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
  fontSize: 14,
  color: 'white',
  lineHeight: '48px'
}

const navigationBarPlaceholderStyle = {
    width: '100%',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'lightgray',
}

const buttonStyle = {
  position: 'absolute',
  top: '0px',
  right: '18px',
  fontSize: '18px',
  color: 'white',
  background: 'transparent',
  border: 'none',
  fontWeight: 'bold',
  lineHeight: '48px'
}

const iconStyle = {
  position: 'absolute',
  top: '12px',
  right: '18px',
  width: '24px'
}

const NavigationBar = (props) => {

  return (
    <div>

      <div style={navigationBarPlaceholderStyle}>Top of the conversation!</div>

      <div style={containerStyle}>

        { props.hideBack ? null : <img style={backIconStyle} src={api.baseUrl + "/images/login/backButton@3x.png"} alt="Back" onClick={props.backIconClicked || props.history.goBack} />}

        <div style={titleStyle}>{props.title}</div>

        { props.action ? <button style={buttonStyle} onClick={props.onActionButtonClicked}>{props.action}</button> : null }

        { props.rightContent || null }

      </div>

    </div>
  )
}

export default withRouter(NavigationBar)

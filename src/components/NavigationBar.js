import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'

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

const NavigationBar = (props) => {

  return (
    <div>

      <div style={navigationBarPlaceholderStyle}></div>

      <div style={containerStyle}>

        <img style={backIconStyle} src={api.baseUrl + "/images/login/backButton@3x.png"} alt="Back" onClick={props.backIconClicked || props.history.goBack} />

        <div style={titleStyle}>{props.title}</div>

       {props.action ? <button style={buttonStyle} onClick={props.onActionButtonClicked}>{props.action}</button> : null}

      </div>

    </div>
  )
}

export default withRouter(NavigationBar)
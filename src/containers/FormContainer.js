import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import TransparentNavigationBar from '../components/TransparentNavigationBar'

const inWxApp = newApi.inWxApp;

var containerStyle = {
  width: '100%',
  minHeight: '100%',
  backgroundImage: 'url(' + api.baseUrl + '/images/login/backgroungImage@2x.png)',
  backgroundRepeat: 'repeat-y',
  backgroundSize: '100% auto',
  backgroundPosition: '50% 0',
  overflow: 'hidden',
}

var navbarStyle = {
  width: '100%',
  height: '36px',
}

var backIconContainerStyle = {
  width: '36px',
  height: '36px',
  float: 'left',
  textAlign: 'center'
}

var titleStyle = {
  marginRight: '36px',
  lineHeight: '36px',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '200',
}

var backIconStyle = {
  margin: '4px'
}

var formContainer = {
  margin: '55% auto 35%',
  width: '76.27%',
}

function FormContainer(props) {

  function back() {
    if (inWxApp && window.wx && props.root) {
      return () => {window.wx.miniProgram.switchTab({url: "/pages/index/index"})};
    } else {
      return props.backIconClicked;
    }
  }

  return (
    <div style={{...containerStyle, ...props.style}} >
    
      <TransparentNavigationBar title={props.title} backIconClicked={back()} />
      
      <div style={{...formContainer, ...props.formStyle}}>
        {props.innerHtml}
      </div>

    </div>
  )
}

function mapStateToProps(state) {
  const { isLogin, redirectUrl } = state
  return { isLogin, redirectUrl }
}

export default connect(mapStateToProps)(FormContainer)

import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../api'
import TransparetnNavigationBar from '../components/TransparentNavigationBar'

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

  if (props.isLogin) {
    return (
      <Redirect to={api.baseUrl + "/"} />
    )
  }

  return (
    <div style={containerStyle}>
    
      <TransparetnNavigationBar title={props.title} previousPage={props.previousPage} />
      
      <div style={formContainer}>
        {props.innerHtml}
      </div>

    </div>
  )
}

function mapStateToProps(state) {
  const isLogin = state.isLogin
  return {isLogin}
}

export default connect(mapStateToProps)(FormContainer)

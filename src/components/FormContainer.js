import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

var container = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url(images/login/backgroungImage@2x.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
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
  textAlign: 'center'
}

var backIconStyle = {
  marginTop: '8px',
  width: '9px',
  height: '15px'
}

var formContainer = {
  width: '80%',
  margin: '200px auto'
}

function FormContainer(props) {

  if (props.isLogin) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <div style={container}>

      <Link to="/user">
        <div style={backIconContainerStyle}>
          <img style={backIconStyle} src="images/login/backButton@3x.png" alt="Back" />
        </div>
      </Link>

      <p style={titleStyle}>{props.title}</p>

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
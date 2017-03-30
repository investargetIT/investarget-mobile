import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

var containerStyle = {
  width: '100%',
  minHeight: '100%',
  backgroundImage: 'url(images/login/backgroungImage@2x.png)',
  backgroundRepeat: 'no-repeat',
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
      <Redirect to="/" />
    )
  }

  return (
    <div style={containerStyle}>
    
      <div style={navbarStyle}>
        <Link to={props.previousPage}>
          <div style={backIconContainerStyle}>
            <img style={backIconStyle} src="images/ic_navigate_before.svg" alt="Back" />
          </div>
        </Link>

        <p style={titleStyle}>{props.title}</p>
      </div>

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
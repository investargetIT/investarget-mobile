import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'


var navbarStyle = {
  width: '100%',
  height: '36px',
  marginTop: '3.673rem',
}

var backIconContainerStyle = {
  width: 48,
  height: 48,
  float: 'left',
  textAlign: 'center'
}

var titleStyle = {
  marginRight: 48,
  lineHeight: '48px',
  textAlign: 'center',
  fontSize: 16,
  fontWeight: '200',
}

var backIconStyle = {
  margin: 12, 
}

function TransparentNavigationBar(props) {
  return (
      <div style={{ ...navbarStyle, ...props.style }}>
          <div style={backIconContainerStyle} onClick={props.backIconClicked || props.history.goBack}>
              <img style={backIconStyle} src={api.baseUrl + "/images/ic_navigate_before.svg"} alt="Back" />
          </div>
          <p style={titleStyle}>{props.title}</p>
      </div>
  )
}

export default withRouter(TransparentNavigationBar)
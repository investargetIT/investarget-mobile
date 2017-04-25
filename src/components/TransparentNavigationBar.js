import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'


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

function TransparentNavigationBar(props) {
  return (
      <div style={navbarStyle}>
          <div style={backIconContainerStyle} onClick={props.backIconClicked || props.history.goBack}>
              <img style={backIconStyle} src={api.baseUrl + "/images/ic_navigate_before.svg"} alt="Back" />
          </div>
          <p style={titleStyle}>{props.title}</p>
      </div>
  )
}

export default withRouter(TransparentNavigationBar)
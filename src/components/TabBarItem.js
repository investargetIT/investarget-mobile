import React from 'react'
import { Link } from 'react-router-dom'

var tabBarItemStyle = {
  textAlign: 'center',
  flex: 1
}

var iconStyle = {
  width: '20px',
  height: '20px'
}

var labelStyle = {
  fontSize: '10px',
  color: 'gray'
}

const TabBarItem = (props) => {

  var content
  if (props.route) {
    content = <Link to={props.route}>
      <img style={iconStyle} alt={props.label} src={props.iconSrc} />
      <p style={labelStyle}>{props.label}</p>
    </Link>
  } else if (props.url) {
    content = <a href={props.url}>
      <img style={iconStyle} alt={props.label} src={props.iconSrc} />
      <p style={labelStyle}>{props.label}</p>
    </a>
  }

  return (
    <div className="tab-bar-item" style={tabBarItemStyle}>
      {content}
    </div>
  )
}

export default TabBarItem

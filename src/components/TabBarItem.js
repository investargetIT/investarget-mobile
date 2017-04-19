import React from 'react'
import { Link } from 'react-router-dom'

var tabBarItemStyle = {
  textAlign: 'center',
  flex: 1
}

var iconStyle = {
  width: '24px',
  height: '24px'
}

var labelStyle = {
  fontSize: '10px',
  color: 'gray',
  WebkitMarginBefore: 0,
  WebkitMarginAfter: 0
}

const TabBarItem = (props) => {
  
  var labelStyle = {
    fontSize: '10px',
    color: props.isActive ? '#10458F' : 'gray',
    WebkitMarginBefore: 0,
    WebkitMarginAfter: 0
  }
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

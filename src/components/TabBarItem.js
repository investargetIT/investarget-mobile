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

const TabBarItem = (props) => {

  var labelStyle = {
    fontSize: '10px',
    color: props.isActive ? '#10458F' : 'gray',
  }
  var content
  if (props.route) {
    content = <Link to={props.route}>
      <div>
	<img style={iconStyle} alt={props.label} src={props.iconSrc} />
	<p style={labelStyle}>{props.label}</p>
      </div>
    </Link>
  } else if (props.url) {
    content = <a href={props.url}>
      <div><img style={iconStyle} alt={props.label} src={props.iconSrc} />
	<p style={labelStyle}>{props.label}</p></div>
    </a>
  }

  return (
    <div className="tab-bar-item" style={tabBarItemStyle}>
      {content}
    </div>
  )
}

export default TabBarItem

import React from 'react'

var itemContainerStyle = {
  display: 'flex',
  padding: '6px 30px'
}

var iconStyle = {
  width: '20px',
  height: '20px'
}

var iconContainerStyle = {
  paddingRight: '14px'
}

function LeftIconRightLabel(props) {
  return (
    <li style={itemContainerStyle}>
      <div style={iconContainerStyle}><img alt="" style={iconStyle} src={props.icon} /></div>
      <div><span>{props.label}</span></div>
    </li>
  )
}

export default LeftIconRightLabel
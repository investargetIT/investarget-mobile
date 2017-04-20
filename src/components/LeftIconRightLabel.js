import React from 'react'

var itemContainerStyle = {
  display: 'flex',
  padding: '6px 30px',
  alignItems: 'center',
}

var iconStyle = {
  width: '20px',
  height: 'auto',
  marginRight: '14px'
}

function LeftIconRightLabel(props) {
  return (
    <li style={itemContainerStyle} onClick={props.onClick}>
      <img alt="" style={iconStyle} src={props.icon} />
      <span>{props.label}</span>
    </li>
  )
}

export default LeftIconRightLabel
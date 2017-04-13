import React from 'react'

const itemContainerStyle = {
  backgroundColor: 'white',
  marginBottom: '1px'
}

const labelContainerStyle = {
  float: 'left',
  width: '28%',
  lineHeight: '42px',
  fontSize: '14px',
  paddingLeft: '16px'
}

const inputContainerStyle = {
  lineHeight: '42px',
  marginLeft: '28%',
  fontSize: '14px',
  paddingRight: '10px'
}

function LeftLabelRightContent(props) {
  return (
    <div style={itemContainerStyle}>
      <div style={labelContainerStyle}>{props.label}</div>
      <div style={inputContainerStyle}>{props.content}</div>
    </div>
  )

}

export default LeftLabelRightContent
import React from 'react'

const itemContainerStyle = {
  backgroundColor: 'white',
  marginBottom: '1px'
}

const labelContainerStyle = {
  float: 'left',
  width: '30%',
  lineHeight: '42px',
  fontSize: '16px',
  paddingLeft: '20px'
}

const inputContainerStyle = {
  lineHeight: '42px',
  marginLeft: '30%',
  fontSize: '16px'
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
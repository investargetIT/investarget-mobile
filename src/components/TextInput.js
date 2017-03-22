import React from 'react'

var containerStyle = {
  position: 'relative'
}

var inputIconStyle = {
  float: 'left',
  width: '30px',
  height: '30px'
}

var inputStyle = {
  width: '80%',
  marginLeft: '10px',
  lineHeight: '30px',
  fontSize: '16px',
  backgroundColor: 'transparent',
}

var rightContentStyle = {
  position: 'absolute',
  right: 0,
  top: 0
}

function TextInput(props) {
  
  if (props.iconUrl) {
    var icon = <img src={props.iconUrl} alt={props.iconAlt} style={inputIconStyle} />
  }

  if (props.rightContent) {
    var rightContent = <div style={rightContentStyle}>{props.rightContent}</div>
  }
  return (
    <div style={containerStyle}>
      {icon}
      <input name={props.name} type="text" placeholder={props.placeholder} style={inputStyle} onChange={props.handleInputChange} />
      {rightContent}
    </div>
  )
}

export default TextInput
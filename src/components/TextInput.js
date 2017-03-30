import React from 'react'

var containerStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}

var inputIconStyle = {
  marginRight: '20px',
  width: '30px',
  height: '30px',
}

var inputWrapStyle = {
  position: 'relative',
  flexGrow: '1',
}

var inputStyle = {
  width: '100%',
  border: 'none',
  borderBottom: '1px solid rgb(34, 105, 212)',
  outline: 'none',
  lineHeight: '30px',
  fontSize: '16px',
  backgroundColor: 'transparent',
}

var rightContentStyle = {
  position: 'absolute',
  right: '0',
  top: '0',
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
      <div style={inputWrapStyle}>
        <input name={props.name} type="text" placeholder={props.placeholder} style={inputStyle} onChange={props.handleInputChange} />
        {rightContent}
      </div>
    </div>
  )
}

export default TextInput
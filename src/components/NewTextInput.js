import React from 'react'

var containerStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#F0F0F0',
  padding: '10px 20px',
  borderRadius: 6,
}

var iconStyle = {
  flexShrink: '0',
  marginRight: '20px',
  width: '30px',
  height: '30px',
}

var inputWrapStyle = {
  flexGrow: '1',
}

var inputStyle = {
  width: '100%',
  borderBottom: '1px solid rgb(34, 105, 212)',      
  outline: 'none',
  lineHeight: '30px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '0.68rem',
}

var rightContentStyle = {
  position: 'absolute',
  top: '0',
  right: '0',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}


function TextInput(props) {
  
  if (props.iconUrl) {
    var icon = <img style={iconStyle} src={props.iconUrl} alt={props.iconAlt} />
  }

  if (props.rightContent) {
    var rightContent = <div style={rightContentStyle}>{props.rightContent}</div>
  }
  return (
    <div style={containerStyle}>
      <div style={inputWrapStyle}>
        <input style={inputStyle} type={props.type ? props.type : 'text'} name={props.name} placeholder={props.placeholder} onChange={props.handleInputChange} value={props.value} />
      </div>
      {rightContent}
    </div>
  )
}

export default TextInput
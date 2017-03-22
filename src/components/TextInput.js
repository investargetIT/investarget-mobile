import React from 'react'

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

function TextInput(props) {
  return (
    <div>
      <img src={props.iconUrl} alt={props.iconAlt} style={inputIconStyle} />
      <input name={props.name} type="text" placeholder={props.placeholder} style={inputStyle} onChange={props.handleInputChange} />
    </div>
  )
}

export default TextInput
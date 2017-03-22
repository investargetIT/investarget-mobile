import React from 'react'

const buttonContainerStyle = {
  marginTop: '10px'
}

const normalStyle = {
  width: '100%',
  height: '38px',
  background: '#2269D4',
  fontSize: '16px',
  borderRadius: '20px',
  border: '1px solid #2269D4',
  color: 'white'
}

const transparentStyle = Object.assign({}, normalStyle, {
  background: 'transparent',
  color: '#2269D4'
})

const disabledStyle = Object.assign({}, normalStyle, {
  background: 'gray',
  border: '1px solid gray'
})

function Button(props) {
  const buttonStyle = props.disabled ? disabledStyle : props.isTransparent ? transparentStyle : normalStyle
  return (
    <div style={buttonContainerStyle}>
      <button type="button" name={props.name} style={buttonStyle} onClick={props.onClick} disabled={props.disabled}>{props.value}</button>
    </div>
  )
}

export default Button
import React from 'react'


/**
 * 优先级 type < isTransparent < disabled
 * type: Enum, ["secondary", "primary"]
 * isTransparent: Boolean,
 * disabled: Boolean,
 */

const buttonContainerStyle = {
}

const normalStyle = {
  width: '100%',
  height: '42px',
  fontSize: 'inherit',
  borderRadius: '21px',
}

const primaryStyle = {
  background: '#2269D4',
  border: '1px solid #2269D4',
  color: 'white'
}

const secondaryStyle = {
  background: '#fff',
  border: '1px solid #2269D4',
  color: '#2269D4',
}

const transparentStyle = {
  background: 'transparent',
}

const disabledStyle = {
  color: '#fff',
  background: 'grey',
  border: '1px solid grey',
}

function Button(props) {

  var buttonStyle;
  if (props.type == 'primary') {
    buttonStyle = Object.assign({}, normalStyle, primaryStyle)
  } else if (props.type == 'secondary') {
    buttonStyle = Object.assign({}, normalStyle, secondaryStyle)
  } else {
    buttonStyle = Object.assign({}, normalStyle, props.style || {})
  }

  if (props.isTransparent) {
    buttonStyle = Object.assign({}, buttonStyle, transparentStyle)
  }

  if (props.disabled) {
    buttonStyle = Object.assign({}, buttonStyle, disabledStyle)
  }

  return (
    <div style={buttonContainerStyle}>
      <button type="button" name={props.name} style={buttonStyle} onClick={props.onClick} disabled={props.disabled}>{props.value}</button>
    </div>
  )
}

export default Button
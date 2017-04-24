import React from 'react'
import api from '../api'

const height = 44

var iconStyle = {
  width: '20px',
  height: '20px',
  margin: (height - 20) / 2 + 'px 0px'
}

const leftIconContainerStyle = {
  float: 'left',
  width: '42px',
  height: height + 'px'
}

const rightIconContainerStyle = {
  float: 'right',
  width: '48px',
  height: height + 'px',
  textAlign: 'center'
}

const labelContainerStyle = {
  lineHeight: height + 'px',
  color: '#333',
  fontSize: '16px'
}

const rightIconStyle = {
  width: '24px',
  height: '24px',
  margin: (height - 24) / 2 + 'px 0px'
}

const container = {
  position: 'relative',
  marginLeft: '22px',
}

var itemContainerStyle = {
  zIndex: 2,
  position: 'relative'
}

function LeftIconRightLabel(props) {

  const border = {
    WebkitTransform: 'scale(0.5)',
    transform: 'scale(0.5)',
    position: 'absolute',
    borderBottom: '1px solid lightGray',
    top: '-50%',
    right: '-50%',
    bottom: '-50%',
    left: '-50%',
  }

  if (props.hideBorder) {
    delete border.borderBottom
  }

  return (
    <div style={container}>

      <div style={itemContainerStyle} onClick={props.onClick}>
        <div style={leftIconContainerStyle}>
          <img alt="" style={iconStyle} src={props.icon} />
        </div>

        <div style={rightIconContainerStyle}>
          <img alt="" style={rightIconStyle} src={api.baseUrl + "images/userCenter/ic_chevron_right_black_24px.svg"} />
        </div>

        <div style={labelContainerStyle}><span>{props.label}</span></div>
      </div>

      <div style={border}></div>

    </div>
  )
}

export default LeftIconRightLabel
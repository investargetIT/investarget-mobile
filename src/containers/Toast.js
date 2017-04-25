import React from 'react'
import { connect } from 'react-redux'

function Toast(props) {

  var wrapStyle = {
    
  }
  
  var style = {
    position: 'absolute',
    left: '50%',
    top: '200px',
    zIndex: 99,
    marginLeft: '-100px',
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '200px',
    height: '100px',
    borderRadius: '5px',
    backgroundColor: 'rgba(17,17,17,.7)',
  }

  var textStyle = {
    fontSize: '16px',
    textAlign: 'center',   
    color: '#fff',
    maxHeight: '3em',
    lineHeight: '1.5',
    overflow: 'hidden',
  }

  if (props.showToast) {
      style.display = 'flex'
  }

  return (
    <div style={wrapStyle}>
      <div style={style}>
        <p style={textStyle}>{props.toastMessage}</p>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { showToast, toastMessage } = state
  return { showToast, toastMessage }
}

export default connect(mapStateToProps)(Toast)
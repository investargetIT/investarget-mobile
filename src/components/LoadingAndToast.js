import React from 'react'
import { connect } from 'react-redux'

function LoadingAndToast(props) {

  var wrapStyle = {
    
  }
  
  var style = {
    position: 'absolute',
    left: '50%',
    top: '200px',
    zIndex: 99,
    marginLeft: '-50px',
    display: props.isFetching || props.isError ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '5px',
    backgroundColor: 'rgba(17,17,17,.7)',
  }

  var loadingIconStyle = {
    marginBottom: '4px',
  }

  var textStyle = {
    fontSize: '16px',
    textAlign: 'center',   
    color: '#fff',
    maxHeight: '3em',
    lineHeight: '1.5',
    overflow: 'hidden',
  }

  if (props.isError) {
    style.width = '200px'
    style.marginLeft = '-100px'
  }

  var message = props.isError ? props.errorMsg : '请稍等...'

  if (props.isFetching) {
    var loadingIcon = <img src="images/loading2.svg" style={loadingIconStyle} alt=""/>
  }

  return (
    <div style={wrapStyle}>
      <div style={style}>
        {loadingIcon}
        <p style={textStyle}>{message}</p>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { isFetching, isError, errorMsg } = state
  return { isFetching, isError, errorMsg }
}

export default connect(mapStateToProps)(LoadingAndToast)
import React from 'react'
import { connect } from 'react-redux'

function LoadingAndToast(props) {

  var style = {
    padding: '20px',
    display: props.isFetching || props.isError ? 'block' : 'none',
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    backgroundColor: 'lightGray',
    zIndex: 99
  }

  var message = props.isError ? props.errorMsg : '请稍等...'

  return <p style={style}>{message}</p>
}

function mapStateToProps(state) {
  const { isFetching, isError, errorMsg } = state
  return { isFetching, isError, errorMsg }
}

export default connect(mapStateToProps)(LoadingAndToast)
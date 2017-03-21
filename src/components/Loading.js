import React from 'react'
import { connect } from 'react-redux'

function Loading(props) {
  var style = {
    padding: '20px',
    display: props.isShown ? 'block' : 'none',
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    backgroundColor: 'lightGray',
    zIndex: 99
  }
  return <p style={style}>请稍等...</p>
}

function mapStateToProps(state) {
  const isShown = state.isFetching
  return { isShown }
}

export default connect(mapStateToProps)(Loading)
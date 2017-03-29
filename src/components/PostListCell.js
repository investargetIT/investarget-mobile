import React from 'react'

var titleStyle = {
  width: '100%',
  position: 'absolute',
  left: 0,
  bottom: 0,
  color: 'white',
  padding: '10px',
  fontSize: '16px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
}

const PostListCell = (props) => {

  const containerStyle = {
    width: '100%',
    height: '200px',
    position: 'relative',
    margin: '5px 0',
    backgroundImage: 'url(' + props.imgUrl + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <a href={props.detailUrl}>
      <div style={containerStyle}>
        <p style={titleStyle}>{props.title}</p>
      </div>
    </a>
  )
}

export default PostListCell
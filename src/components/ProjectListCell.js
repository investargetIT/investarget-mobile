import React from 'react'

var contentWapperStyle = {
  float: 'left',
  width: '66%'
}

var imgWrapper = {
  width: '100px',
  height: '80px'
}

var countryAndIndustrys = {
  fontSize: '12px',
  color: 'gray'
}

var amount = {
  color: 'orange'
}

function ProjectListCell(props) {
  return (
    <div>
      <div style={contentWapperStyle}>
        <p>{props.title}</p>
        <p style={countryAndIndustrys}><span>{props.country}</span><span>{props.industrys}</span></p>
        <p style={countryAndIndustrys}>交易规模：<span style={amount}>${props.amount}</span></p>
      </div>
      <div >
        <img style={imgWrapper} src={props.imgUrl} alt={props.title} />
      </div>
      <hr />
    </div>
  )
}

export default ProjectListCell
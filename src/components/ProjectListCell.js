import React from 'react'

var containerStyle = {
  padding: '7px',
  marginBottom: '2px',
  backgroundColor: 'white'
}

var contentWapperStyle = {
  padding: '6px 20px 6px 10px',
  float: 'left',
  width: '66%'
}

var imgWrapper = {
  display: 'block',
  width: '34%',
  height: '104px'
}

var titleStyle = {
  color: '#666666',
  fontSize: '15px'
}

var countryAndIndustrys = {
  marginTop: '10px',
  fontSize: '13px',
  color: '#999999'
}

var countryStyle = {
  display: 'block',
  float: 'left',
  width: '60px'
}

var amountContainerStyle = {
  marginTop: '10px',
  fontSize: '13px',
  color: '#666666'
}

var amount = {
  color: '#FF8F40'
}

function ProjectListCell(props) {
  return (
    <div style={containerStyle}>

      <div style={contentWapperStyle}>
        <p style={titleStyle}>{sliceStringIfTooLong(props.title, 20)}</p>

        <p style={countryAndIndustrys}>
          <span style={countryStyle}>{sliceStringIfTooLong(props.country, 3)}</span>
          <span>{sliceStringIfTooLong(props.industrys, 6)}</span>
        </p>

        <p style={amountContainerStyle}>交易规模：<span style={amount}>${new Intl.NumberFormat().format(props.amount)}</span></p>
      </div>

      <img style={imgWrapper} src={props.imgUrl} alt={props.title} />

    </div>
  )
}

function sliceStringIfTooLong(str, maxLength) {
  if (str.length <= maxLength) {
    return str
  } else {
    return str.substr(0, maxLength) + '...'
  }
}

export default ProjectListCell
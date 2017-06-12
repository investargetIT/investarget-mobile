import React from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

var containerStyle = {
  position: 'relative',
  padding: '7px',
  backgroundColor: 'white'
}

var contentWapperStyle = {
  padding: '6px 20px 6px 10px',
  float: 'left',
  width: '66%'
}

var imgBaseWrapper = {
  float: 'left',
  display: 'block',
  width: '34%',
  height: '104px',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}

var titleStyle = {
  color: '#666666',
  fontSize: '15px',
  verticalAlign: 'middle'
}

var countryAndIndustrys = {
  marginTop: '8px',
  fontSize: '13px',
  color: '#999999'
}

var countryStyle = {
  display: 'block',
  float: 'left',
  width: '60px'
}

var amountContainerStyle = {
  marginTop: '8px',
  fontSize: '13px',
  color: '#666666'
}

const placeholderStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

function ProjectListCell(props) {
  var imgWrapper = Object.assign({}, imgBaseWrapper, {
    backgroundImage: 'url("' + props.imgUrl + '")',
  })

  function handleClickEmail() {
    const userAgent = window.navigator.userAgent
    if (userAgent.indexOf('iPhone') == -1 && userAgent.indexOf('iPad') == -1) {
      props.showEmail()
    }
  }

  return (
    <div style={containerStyle} className="clearfix">

      <div style={contentWapperStyle}>
        <p data-id={props.id} data-is-market-place={props.isMarketPlace}>
          {!props.isMarketPlace ? <img style={{ verticalAlign: 'middle', marginRight: 4 }} src={api.baseUrl + '/images/tag.png'} alt="" /> : null}
          <span style={titleStyle} data-id={props.id} data-is-market-place={props.isMarketPlace}>{sliceStringIfTooLong(props.title, 20)}</span>
        </p>

        <p style={countryAndIndustrys} data-id={props.id} data-is-market-place={props.isMarketPlace}>
          <span style={countryStyle} data-id={props.id} data-is-market-place={props.isMarketPlace}>{sliceStringIfTooLong(props.country, 3)}</span>
          <span data-id={props.id} data-is-market-place={props.isMarketPlace}>{sliceStringIfTooLong(props.industrys, 6)}</span>
        </p>

        {!props.isMarketPlace ?
          <p style={amountContainerStyle} data-id={props.id} data-is-market-place={props.isMarketPlace}>交易规模：<span data-id={props.id} data-is-market-place={props.isMarketPlace} style={{ color: props.amount > 0 ? '#FF8F40' : '#666666' }}>{props.amount > 0 ? "$" + new Intl.NumberFormat().format(props.amount) : "N/A"}</span></p>
          :
          <div style={{ marginTop: 8 }} data-id={props.id} data-is-market-place={props.isMarketPlace}>
            <a href="tel:13816225193"><img style={{ width: 24, height: 24, marginRight: 40 }} src={api.baseUrl + '/images/phone@2x.png'} alt="" /></a>
            <a href="mailto:sidu.he@investarget.com" onClick={handleClickEmail}><img style={{ width: 24, height: 24, marginRight: 40 }} src={api.baseUrl + '/images/email@2x.png'} alt="" /></a>
          </div>}
      </div>

      <div style={imgWrapper} data-id={props.id} data-is-market-place={props.isMarketPlace}></div>
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

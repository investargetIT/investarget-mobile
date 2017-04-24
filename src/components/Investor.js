import React from 'react'
import api from '../api'

const investorContainerStyle = { 
  textAlign: 'center'
}

const investorAvatarStyle = { 
  width: '40px',
  height: '40px',
  borderRadius: '50%'
}

const investarOrgStyle = { 
  width: '73px',
  height: '15px',
  lineHeight: '15px',
  overflow: 'hidden',
  margin: '8px auto 5px',
  fontSize: '13px',
  color: '#333333',
  borderLeft: '2px solid #034286',
}

const investarNameStyle = { 
  fontSize: '12px',
  color: '#838383',
  height: '14px',
  lineHeight: '14px',
  overflow: 'hidden',
}

function Investor(props) {
  return (
    <div style={investorContainerStyle}>
      <img style={investorAvatarStyle} src={props.photoUrl ? props.photoUrl : api.baseUrl + "/images/userCenter/defaultAvatar@2x.png"} alt="" />
      <p style={investarOrgStyle}>{props.org}</p>
      <p style={investarNameStyle}>{props.name}</p>
    </div>
  )
}

export default Investor

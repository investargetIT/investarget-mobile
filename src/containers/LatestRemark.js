import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import Investor from '../components/Investor.js'

const remarkContainerStyle = {
  backgroundColor: 'white',
  padding: '10px'
}

const contentStyle = {
  margin: '8px 0px',
  color: '#666666',
  fontSize: '12px'
}

const statusStyle = {
  fontSize: '11px',
  color: '#777777'
}

const dividerStyle = {
  borderTop: '1px solid #10458F'
}

function Remark(props) {
  return (
    <div style={remarkContainerStyle}>
      <div>最新备注</div>
      <hr style={dividerStyle} />
      <div style={contentStyle}>Questioniar sent. Howerer tje contac person id now in vocation/ So we need to wait dor hie back.</div>
      <div style={statusStyle}>当前状态：step3，获取投资备忘录</div>
    </div> 
  )
}

const backgroundImageStyle = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  zIndex: -1
}

const investorContainerStyle = {
  width: '30%',
  float: 'left'
}

const remarkContainerStyle1 = {
  marginLeft: '30%',
  marginRight: '30px'
}

const itemContainerStyle = {
  margin: '16px 0px'
}

class LatestRemark extends Component {
  render(){
    return (
      <div>

	<img style={backgroundImageStyle} src="/images/timeline/timeLineBG@2x.png" alt="" />      

	<NavigationBar title="最新备注" />

	<div style={itemContainerStyle}>
	  <div style={investorContainerStyle}>
	    <Investor org="Investarget" name="无军可" />
	  </div>
	  <div style={remarkContainerStyle1}>
	    <Remark />
	  </div>
	</div>  

	<div style={itemContainerStyle}>
	  <div style={investorContainerStyle}>
	    <Investor org="Investarget" name="无军可" />
	  </div>
	  <div style={remarkContainerStyle1}>	
	    <Remark />
	  </div>
	</div>

	<div style={itemContainerStyle}>
	  <div style={investorContainerStyle}>
	    <Investor org="Investarget" name="无军可" />
	  </div>
	  <div style={remarkContainerStyle1}>
	    <Remark />
	  </div>
	</div>

      </div>
    )
  }
}

export default LatestRemark

import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import Investor from '../components/Investor.js'
import api from '../api'
import { handleError } from '../actions/'

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
      <div style={contentStyle}>{props.content}</div>
      <div style={statusStyle}>当前状态：{props.status}</div>
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
  margin: '16px 0px',
  overflow: 'auto'
}

class LatestRemark extends Component {

  constructor(props) {
    super(props)
    this.state = {timelines: []}
  }

  componentDidMount(){
    var timelines = this.props.location.state
    for (let a = 0; a < timelines.length; a++) {
      api.getUserRemarks(
	timelines[a].timeLineId,
	data => {
	  timelines[a]['latestRemarkContent'] = data.length > 0 ? data[0].remark : '暂无'
	  this.setState({timelines: timelines})
	},
	error => this.dispatch(handleError((error)))
       )
      api.getUserBasic(
	timelines[a].investorId,
	data => {
	  timelines[a]['investorOrgName'] = data.company
	  this.setState({timelines: timelines})
	},
	error => this.dispatch(handleError((error)))
      )
    }
  }

  render(){

    var content = this.state.timelines.map(item => (

	<div style={itemContainerStyle} key={item.timeLineId}>
	  <div style={investorContainerStyle}>
	    <Investor org={item.investorOrgName} name={item.investorName} />
	  </div>
	  <div style={remarkContainerStyle1}>
	    <Remark content={item.latestRemarkContent} status={'step' + item.transactionStatusId + '，' +  item.transactionStatusName} />
	  </div>
	</div>))



    return (
      <div>

	<img style={backgroundImageStyle} src={api.baseUrl + "/images/timeline/timeLineBG@2x.png"} alt="" />

	<NavigationBar title="最新备注" />

	{content}

      </div>
    )
  }
}

export default LatestRemark

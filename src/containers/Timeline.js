import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import { Link } from 'react-router-dom'
import api from '../api'
import { handleError } from '../actions/'

const stepIconStyle = {
  width: '14px',
  height: '14px',
  margin: 'auto'
}

const stepContainerStyle = {
  marginLeft: '50px',
  borderLeft: '1px solid white',
  position: 'relative',
  paddingLeft: '30px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingRight: '48px'
}

const stepAvatarStyle = {
  width: '30px',
  height: '30px',
  marginLeft: '8px',
  borderRadius: '50%'
}

const stepContentContainerStyle = {
  padding: '4px 0px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  position: 'relative',
  borderRadius: '4px'
}

const stepTitleStyle = {
  marginLeft: '8px',
  marginBottom: '5px',
  color: '#10458F'
}

const stepTriangleStyle = {
  width: '12px',
  position: 'absolute',
  left: '-11px',
  top: '6px'
}

class TimelineStep extends Component {

  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
  }
  handleOnClick(investors) {
    this.props.handleStepClicked(investors)
  }
  render() {
    const stepIconContainerStyle = {
      display: 'flex',
      width: '24px',
      height: '24px',
      backgroundColor: this.props.color,
      borderRadius: '50%',
      position: 'absolute',
      left: '-12px',
      top: '14px',
    }

    const iconBlurStyle = Object.assign({}, stepIconContainerStyle, {
      filter: 'blur(3px)',
    })

    return (
      <div style={stepContainerStyle} onClick={this.handleOnClick.bind(this, this.props.investors)} data-investors={this.props.investors}>
	<div style={iconBlurStyle}></div>
	<div style={stepIconContainerStyle}>
	  <img style={stepIconStyle} src={this.props.icon} alt="" />
	</div>
	<div style={stepContentContainerStyle}>
	  <img style={stepTriangleStyle} src="/images/timeline/Triangle.svg" alt="" />
	  <div style={stepTitleStyle}>{this.props.title}</div>

	  {Array.isArray(this.props.investors) ? this.props.investors.map((item, index) =>
	    <img key={index} style={stepAvatarStyle} src={item.investorPhotoUrl || "/images/userCenter/defaultAvatar@2x.png"} alt="" />
	  ) : null}

	</div>
      </div>
    )
  }
}

const backgroundImageStyle = {
  position: 'fixed',
  width: '100%',
  height: '100%',
}

const stepIconContainerStyle = {
  display: 'flex',
  width: '10px',
  height: '10px',
  border: '1px solid orange',
  backgroundColor: 'white',
  borderRadius: '50%',
  position: 'absolute',
  left: '-6px',
  top: '20px',
}

const titleStyle = {
  paddingLeft: '20px',
  paddingRight: '12px',
  color: 'white',
  fontSize: '16px',
  lineHeight: '26px'
}

const titleContainerStyle = {
  height: '25px',
  overflow: 'hidden',
  backgroundImage: 'url(/images/timeline/timeline-title-bg.svg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'auto 100%',
  backgroundPosition: 'left top',
  display: 'inline-block'
}

const titleContainerStyle2 = {
  marginLeft: '50px',
  borderLeft: '1px solid white',
  position: 'relative',
  paddingLeft: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingRight: '48px'
}

class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      timelines: [],
      myInvestor: [] 
    }

    this.handleStepClicked = this.handleStepClicked.bind(this)
  }

  componentDidMount() {
    api.getLinesBasic(
      this.props.match.params.id,
      data => {
	this.setState({timelines: data.items})
      },
      error => console.error(error)
    )
    api.getUsers(
      data => {
	const myInvestor = data.items.map(item => {
	  var object = {}
	  object.id = item.id
	  object.name = item.name
	  object.org = item.company
	  object.photoUrl = item.photoUrl
	  return object
	})
	this.setState({myInvestor: myInvestor})
      },
      error => this.props.dispatch(handleError(error))
    )

  }

  handleStepClicked(investors) {
    const myInvestorId = this.state.myInvestor.map(item => item.id)
    const investorIds = investors.map(item => item.investorId)
    var result = []
    for (var a = 0;a < myInvestorId.length;a++) {
      var index = investorIds.indexOf(myInvestorId[a])
      if (index > -1) {
	result.push(a)
      }
    }
    if (result.length === 0) {
      var toObj = {
	pathname: '/latest_remark',
	state: { foo: "bar" },
      }
      this.props.history.push(toObj)
    }
  }

  render() {
    return (
      <div>
	<NavigationBar title="项目进程" />
	<img style={backgroundImageStyle} src="/images/timeline/timeLineBG@2x.png" alt="" />

	<div style={titleContainerStyle2}>
	  <div style={stepIconContainerStyle}></div>
	  <div style={titleContainerStyle}>
	    <span style={titleStyle}>大使项目</span>
	  </div>
	</div>

	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage1.png" color="#FF6900" title="step1，获取项目概要" investors={this.state.timelines.filter(item=>item.transactionStatusId===1)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage2.png" color="#2AA0AE" title="step2，签署保密协议" investors={this.state.timelines.filter(item=>item.transactionStatusId===2)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage3.png" color="#5649B9" title="step3，获取投资备忘录" investors={this.state.timelines.filter(item=>item.transactionStatusId===3)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage4.png" color="#F94545" title="step4，进入一期资料库" investors={this.state.timelines.filter(item=>item.transactionStatusId===4)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage5.png" color="#0B87C1" title="step5，签署投资意向书/投资条款协议" investors={this.state.timelines.filter(item=>item.transactionStatusId===5)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage6.png" color="#F5C12D" title="step6，进入二期资料库" investors={this.state.timelines.filter(item=>item.transactionStatusId===6)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage7.png" color="#EB090A" title="step7，进场尽职调查" investors={this.state.timelines.filter(item=>item.transactionStatusId===7)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage8.png" color="#2AA0AE" title="step8，签署约束性报告" investors={this.state.timelines.filter(item=>item.transactionStatusId===8)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage9.png" color="#5649B9" title="step9，起草法律协议" investors={this.state.timelines.filter(item=>item.transactionStatusId===9)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage10.png" color="orange" title="step10，签署法律协议" investors={this.state.timelines.filter(item=>item.transactionStatusId===10)} />
	<TimelineStep handleStepClicked={this.handleStepClicked} icon="/images/timeline/stepImage11.png" color="#10458F" title="step11，完成交易" investors={this.state.timelines.filter(item=>item.transactionStatusId===11)} />
      </div>
    )
  }
}

export default Timeline

import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'

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
  marginLeft: '8px'
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

function TimelineStep(props) {
  const stepIconContainerStyle = {
    display: 'flex',
    width: '24px',
    height: '24px',
    backgroundColor: props.color,
    borderRadius: '50%',
    position: 'absolute',
    left: '-12px',
    top: '14px',
  }

  const iconBlurStyle = Object.assign({}, stepIconContainerStyle, {
    filter: 'blur(3px)',
  })
  return (
    <div style={stepContainerStyle}>
      <div style={iconBlurStyle}></div>
      <div style={stepIconContainerStyle}>
        <img style={stepIconStyle} src={props.icon} alt="" />
      </div>
      <div style={stepContentContainerStyle}>
        <img style={stepTriangleStyle} src="/images/timeline/Triangle.svg" alt="" />
        <div style={stepTitleStyle}>{props.title}</div>

        {Array.isArray(props.avatar) ? props.avatar.map(item =>
          <img style={stepAvatarStyle} src={item} alt="" />
        ) : null}
        
      </div>
    </div>
  )
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

        <TimelineStep icon="/images/timeline/stepImage1.png" color="#FF6900" title="step1，获取项目概要" />
        <TimelineStep icon="/images/timeline/stepImage2.png" color="#2AA0AE" title="step2，签署保密协议" />
        <TimelineStep icon="/images/timeline/stepImage3.png" color="#5649B9" title="step3，获取投资备忘录" />
        <TimelineStep icon="/images/timeline/stepImage4.png" color="#F94545" title="step4，进入一期资料库" />
        <TimelineStep icon="/images/timeline/stepImage5.png" color="#0B87C1" title="step5，签署投资意向书/投资条款协议" />
        <TimelineStep icon="/images/timeline/stepImage6.png" color="#F5C12D" title="step6，进入二期资料库" />
        <TimelineStep icon="/images/timeline/stepImage7.png" color="#EB090A" title="step7，进场尽职调查" />
        <TimelineStep icon="/images/timeline/stepImage8.png" color="#2AA0AE" title="step8，签署约束性报告" />
        <TimelineStep icon="/images/timeline/stepImage9.png" color="#5649B9" title="step9，起草法律协议" />
        <TimelineStep icon="/images/timeline/stepImage10.png" color="orange" title="step10，签署法律协议" />
        <TimelineStep icon="/images/timeline/stepImage11.png" color="#10458F" title="step11，完成交易" />
      </div>
    )
  }
}

export default Timeline
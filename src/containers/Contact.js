import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import LeftLabelRightContent from '../components/LeftLabelRightContent'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const longContentStyle = {
  lineHeight: '24px',
  padding: '9px 0px'
}

class Contact extends Component {

  render() {
    return (
      <div>

        <NavigationBar title="联系我们" />

        <div style={containerStyle}>
          <LeftLabelRightContent label="客服电话：" content="021-31776196" />
          <LeftLabelRightContent label="客服邮箱：" content="customer@investarget.com" />
          <LeftLabelRightContent label="联系地址：" content={<div style={longContentStyle}>中国上海市徐汇区虹桥路777号17楼7单元</div>} />
        </div>

      </div>
    )
  }

}

export default Contact
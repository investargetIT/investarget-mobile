import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import { connect } from 'react-redux'
import LeftLabelRightContent from '../components/LeftLabelRightContent'
import { handleError } from '../actions'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

class ModifyBusinessCard extends Component {

  constructor(props) {
    super(props)
    this.handleItemClicked = this.handleItemClicked.bind(this)
  }

  handleItemClicked() {
    this.props.dispatch(handleError(new Error('Please contact to modify')))
  }

  render() {
    return (
      <div>

        <NavigationBar title="修改名片" />

        <div style={containerStyle}>
          <div onClick={this.handleItemClicked}>
            <LeftLabelRightContent label="姓名" content={this.props.userInfo.name} />
            <LeftLabelRightContent label="公司" content={this.props.userInfo.company} />
            <LeftLabelRightContent label="职位" content={this.props.userInfo.title.titleName} />
            <LeftLabelRightContent label="邮箱" content={this.props.userInfo.emailAddress} />
          </div>
        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  const { userInfo } = state
  return { userInfo }
}

export default connect(mapStateToProps)(ModifyBusinessCard)
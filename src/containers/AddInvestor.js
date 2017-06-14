import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import LeftLabelRightContent from '../components/LeftLabelRightContent'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const cardStyle = {
  width: '100%'
}

const cardImageContainerStyle = {
  position: 'relative'
}

const inputStyle = {
  fontSize: '16px',
  width: '96%',
  border: 'none'
}

class AddInvestor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name: "堂小名",
      title: "副总裁",
      mobile: "18616324385",
      email: "summer.xia@investarget.com"
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit() {

    if (this.state.name === '' || this.state.title === '' || this.state.mobile === '' || this.state.email === '') {
      this.props.dispatch(handleError(new Error('content can not be empty')))
      return
    }   

    const body = {
      name: this.state.name,
      titleId: this.state.title,
      mobile: this.state.mobile,
      emailAddress: this.state.email
    }

    this.props.dispatch(requestContents(''))

    api.checkMobileOrEmailExist(
      this.state.mobile,
      user => {
        console.log(user)
        if (user) {
          // 调用修改用户和新增弱关联交易师接口
        } else {
          // 调用新增用户和分配交易师接口
        }
      },
      error => console.error(error)
    )

    setTimeout(
      () => {
        this.props.dispatch(hideLoading())
        this.props.history.goBack()
      },
      1000
    )
  }

  render() {
    return (
      <div>
        <NavigationBar title="新增投资人" action="提交" onActionButtonClicked={this.handleSubmit} />

        <div style={containerStyle}>

          <div style={cardImageContainerStyle}>
            <img style={cardStyle} alt="" src={ api.baseUrl + "/images/userCenter/emptyCardImage@2x.png" } />
          </div>

          <div>
            <LeftLabelRightContent label="姓名" content={<input name="name" style={inputStyle} value={this.state.name} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="职位" content={<input name="title" style={inputStyle} value={this.state.title} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="手机" content={<input name="mobile" style={inputStyle} value={this.state.mobile} onChange={this.handleInputChange} />} />
            <LeftLabelRightContent label="邮箱" content={<input name="email" style={inputStyle} value={this.state.email} onChange={this.handleInputChange} />} />
          </div>

        </div>

      </div>
    )
  }
}

export default connect()(AddInvestor)

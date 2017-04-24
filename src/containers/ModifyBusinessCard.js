import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import { connect } from 'react-redux'
import LeftLabelRightContent from '../components/LeftLabelRightContent'
import { handleError, requestContents, hideLoading, modifyUserInfo } from '../actions'
import api from '../api'

const containerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

const cardContainerStyle = {
  padding: '0px 16px',
  backgroundColor: 'white',
  minHeight: window.innerHeight - 43*4 - 48
}

const cardStyle = {
  width: '100%'
}

const cardTitleStyle = {
  lineHeight: '36px'
}

const cardTipStyle = {
  color: 'darkRed'
}

const cardImageContainerStyle = {
  position: 'relative'
}

const inputContainerStyle = {
  position: 'absolute',
  width: '100%',
  top: 0,
  left: 0
}

const inputStyle = {
  width: '100%',
  height: '200px',
  opacity: 0
}

class ModifyBusinessCard extends Component {

  constructor(props) {
    super(props)

    this.state = { businessCard: null }

    this.handleItemClicked = this.handleItemClicked.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.readFile = this.readFile.bind(this)
  }

  handleItemClicked() {
    this.props.dispatch(handleError(new Error('Please contact to modify')))
  }

  handleInputChange(e) {
    var file = e.target.files[0];

    if (file) {
      if (/^image\//i.test(file.type)) {
	this.readFile(file);
      } else {
	alert('Not a valid image!');
      }
    }
  }

  readFile(file) {

    var react = this
    var reader = new FileReader();

    reader.onloadend = function () {

      react.setState({ businessCard: reader.result });

      var formData = new FormData()
      formData.append('file', file)
      formData.append('key', 'cardKey')

      api.uploadUserAvatar(
	formData,
	(key, url) => {
	  react.props.dispatch(hideLoading())
	  react.props.dispatch(handleError(new Error('Please wait patient')))
	  const newUserInfo = Object.assign({}, react.props.userInfo, {
	    cardKey: key,
	    cardUrl: url
	  })
	  react.props.dispatch(modifyUserInfo(newUserInfo))
	},
	error => react.props.dispatch(handleError(error)),
	react.props.userInfo.cardKey || null
      )
    }

    reader.onerror = function () {
      alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
    this.props.dispatch(requestContents(''))
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

	  <div style={cardContainerStyle}>
	    
	    <p style={cardTitleStyle}>我的名片:<span style={cardTipStyle}>(名片请横向放置)</span></p>

	    <div style={cardImageContainerStyle}>
	      <img style={cardStyle} src={ this.state.businessCard || this.props.userInfo.cardUrl || api.baseUrl + "/images/userCenter/emptyCardImage@2x.png" } />
	      <div style={inputContainerStyle}>
		<input style={inputStyle} id="file" type="file" accept="image/*" onChange={this.handleInputChange} />
	      </div>
	    </div>

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

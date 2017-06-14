import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const partenerContainerStyle = {
  textAlign: 'center'
}

const partenerAvatarStyle = {
  width: '73px',
  height: '73px',
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

function Partener(props) {
  return (
    <div style={partenerContainerStyle}>
      <img style={partenerAvatarStyle} src={props.photoUrl ? props.photoUrl : api.baseUrl + "/images/userCenter/defaultAvatar@2x.png"} alt="" />
      <p style={investarOrgStyle}>{props.org}</p>
      <p style={investarNameStyle}>{props.name}</p>
    </div>
  )
}

const floatContainerStyle = {
  backgroundColor: 'white',
  overflow: 'auto'
}

const itemStyle = {
  float: 'left',
  width: 100/375*100+'%',
  margin: '8px ' + 75/375/6*100+'%',
}

const iconStyle = {
  width: 24
}

const avatarContainerStyle = {
  position: 'absolute',
  display: 'inline-block',
  top: 12,
  right: 18,
  width: 24
}

const inputContainerStyle = {
  position: 'absolute',
  left: 0,
  top: 0
}

const inputStyle = {
  width: '24px',
  height: '24px',
  opacity: 0
}

class MyPartener extends Component {

  constructor(props) {
    super(props)

    this.state = { myPartener: [] }
  }

  componentDidMount() {

    this.props.dispatch(requestContents(''))
    
    api.getUsers(
      data => {
        this.props.dispatch(hideLoading())

        const myPartener = data.items.map(item => {
          var object = {}
          object.id = item.id
          object.name = item.name
          object.org = item.org ? item.org.name : item.company
          object.photoUrl = item.photoUrl
          return object
        })
        this.setState({myPartener: myPartener})
      },
      error => this.props.dispatch(handleError(error))
    )
  }


  handleAvatarChange(e) {
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

      react.setState({ avatar: reader.result });

      var formData = new FormData()
      formData.append('file', file)
      formData.append('key', 'photoKey')

      //api.uploadUserAvatar(
        //formData,
        //(key, url) => {
          //react.props.dispatch(hideLoading())
          //react.props.dispatch(handleError(new Error('Please wait patient')))
          //const newUserInfo = Object.assign({}, react.props.userInfo, {
            //photoKey: key,
            //photoUrl: url
          //})
          //react.props.dispatch(modifyUserInfo(newUserInfo))
        //},
        //error => react.props.dispatch(handleError(error)),
        //react.props.userInfo.photoKey || null
      //)
    }

    reader.onerror = function () {
      alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
    this.props.dispatch(requestContents(''))
  }

  render() {

    const content = this.state.myPartener.map(
      item => (
        <Link key={item.id} to={{pathname: api.baseUrl + '/chat/' + item.id, state:{name: item.name}}}>
          <div style={itemStyle}>
            <Partener name={item.name} org={item.org} photoUrl={item.photoUrl} />
          </div>
        </Link>
      )
    )

    const rightContent = (
      <div style={avatarContainerStyle}>
        <img style={iconStyle} src={api.baseUrl + "/images/plus.png"} alt="" />
        <div style={inputContainerStyle}><input style={inputStyle} id="file" type="file" accept="image/*" onChange={this.handleAvatarChange} /></div>
      </div>
    )

    return (
      <div>

        <NavigationBar
          title={this.props.userInfo.userType === 1 ? "我的交易师" : "我的投资人"}
          rightContent={rightContent} />

        <div style={floatContainerStyle}>
          {content}
        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  const { userInfo } = state
  return { userInfo }
}

export default connect(mapStateToProps)(MyPartener)

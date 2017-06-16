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

    this.readFile = this.readFile.bind(this)
    window.addEventListener("message", this.receiveMessage, false)
    this.handleAvatarChange = this.handleAvatarChange.bind(this)
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
        console.log(file)
        //readFile(file)
        var react = this
    var reader = new FileReader();

    reader.onloadend = function () {


      var formData = new FormData()
      formData.append('file', file)

      console.log('YXM', react.props)
      react.props.history.push(
        api.baseUrl + '/add_investor',
        {
          name: "YXM",
          image: reader.result,
          mobile: "18616324385",
          email: "fancy@gmail.com",
          company: "三一重工",
          title: 6,
          file: file
        }
      )

      //document.getElementById("myForm").submit()

      //api.uploadCamCard(formData, file.size)
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

      
      //document.getElementById("myForm").submit()
      //api.uploadCamCard(formData)
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

  onLoad(a, b, c) {
    window.aa = a.target
    window.frames["upload_target"].parent.postMessage(JSON.parse(JSON.stringify(a.target)), '*')
    console.log('YXXXM', JSON.stringify(a.target), b, c, window.document.body.innerHtml)
  }

  receiveMessage(event) {
    console.log('YXXXM', event.data)
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
        <div style={inputContainerStyle}>
          <form
            id="myForm"
            encType="multipart/form-data"
            action="http://bcr2.intsig.net/BCRService/BCR_Crop?PIN=abcd&user=summer.xia@investarget.com&pass=P8YSCG7AQLM66S7M&lang=2&json=1&size=4821"
            method="POST"
            target="upload_target">

            <input style={inputStyle} id="file" name="upfile" type="file" accept="image/*" onChange={this.handleAvatarChange} />

          </form>
        </div>
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

        <iframe id="iframe_id" name="upload_target" onLoad={this.onLoad}>
          { console.log('YXM', window.document.body.innerHtml) }
        </iframe>

      </div>
    )
  }

}

function mapStateToProps(state) {
  const { userInfo } = state
  return { userInfo }
}

export default connect(mapStateToProps)(MyPartener)

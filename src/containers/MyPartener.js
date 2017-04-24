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

    return (
      <div>

        <NavigationBar title={this.props.userInfo.userType === 1 ? "我的交易师" : "我的投资人"} backIconClicked={this.props.history.goBack} />

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

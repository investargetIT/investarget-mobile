import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Transform from '../transform'
import AlloyTouch from 'alloytouch'

const loadingStyle = {
  width: '20px'
}

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

    this.state = { 
      myPartener: [],
      isLoadingMore: false
     }

    this.readFile = this.readFile.bind(this)
    this.handleAvatarChange = this.handleAvatarChange.bind(this)
    this.parseData = this.parseData.bind(this)
  }

  componentDidMount() {

    const userId = utils.getCurrentUserId()

    if (this.props.userType == 1 || this.props.userType == 3) {

      let param = this.props.userType == 1 ? { investoruser: userId } : { traderuser: userId }
      param.page_size = 15
      param.page_index = 1
      this.props.dispatch(requestContents(''))
      newApi.getUserRelation(param)
        .then(data => {
          const myPartener = data.data.map(item => {
            const user = this.props.userType == 1 ? item.traderuser : item.investoruser
            const { id, username, org, photourl } = user
            return { id, name: username, org: org ? org.orgname : '', photoUrl: photourl }
          })
          this.setState({ myPartener })
          this.props.dispatch(hideLoading())
        })
        .catch(error => {
          this.props.dispatch(handleError(error))
        })      
    } 

    var scroller = document.querySelector("#scroller"),
      arrow = document.querySelector("#arrow"),
      pull_refresh = document.querySelector("#pull_refresh"),
      alloyTouch = null,
      loading = false;

    Transform(pull_refresh, true);
    Transform(scroller, true);

    var react = this

    alloyTouch = new AlloyTouch({
      touch: "#wrapper1",//反馈触摸的dom
      vertical: true,//不必需，默认是true代表监听竖直方向touch
      target: scroller, //运动的对象
      property: "translateY",  //被滚动的属性
      initialValue: 0,
      min: window.innerHeight - 45 - 48 - 850, //不必需,滚动属性的最小值
      max: 0, //不必需,滚动属性的最大值
      touchStart: function () {
        resetMin();
      },
      change: function (value) {
        if (this.min < 0 && value <= this.min + 5 && !loading) {
          loading = true;
          loadMore();
        }
        pull_refresh.translateY = value;
      },
      touchMove: function (evt, value) {
        if (value > 70) {
          //http://caniuse.com/#search=classList
          arrow.classList.add("arrow_up");
        } else {
          arrow.classList.remove("arrow_up");
        }
      },
      touchEnd: function (evt, value) {
        if (value > 70) {
          this.to(60);
          mockRequest(this);
          // this.touchStart = false;
          return false;
        }
      },
      tap: (evt, value) => {
      }
    })
    
    function resetMin() {
      const result = -1 * parseInt(getComputedStyle(scroller).height, 10) + window.innerHeight - 45 
      alloyTouch.min = result < 0 ? result : 0
    }

    function loadMore() {
      react.setState({ isLoadingMore: true })

      let param = react.props.userType == 1 ? { investoruser: userId } : { traderuser: userId }
      param.page_size = react.state.myPartener.length
      param.page_index = 1
      newApi.getUserRelation(param)
      .then(data => {
        resetMin()
        if (data.data.length > 0) {
        const myPartener = data.data.map(item => {
          const user = react.props.userType == 1 ? item.traderuser : item.investoruser
          const { id, username, org, photourl } = user
          return { id, name: username, org: org ? org.orgname : '', photoUrl: photourl }
        })
        const partner = react.state.myPartener.concat(myPartener)
        react.setState({ myPartener: partner })
        } else {
          alloyTouch.to(alloyTouch.min + 50, 0)
        }
        loading = false
          react.setState({ isLoadingMore: false })
      })
    
      .catch(error => {
        react.props.dispatch(handleError(error))
      })

    }

    function mockRequest(at) {

      pull_refresh.classList.add("refreshing");
      let param = react.props.userType == 1 ? { investoruser: userId } : { traderuser: userId }
      param.page_size = 15
      param.page_index = 1
      newApi.getUserRelation(param)
      .then(data => {
        arrow.classList.remove("arrow_up")
        pull_refresh.classList.remove("refreshing")
        at.to(at.initialValue)
        const myPartener = data.data.map(item => {
          const user = react.props.userType == 1 ? item.traderuser : item.investoruser
          const { id, username, org, photourl } = user
          return { id, name: username, org: org ? org.orgname : '', photoUrl: photourl }
        })
        react.setState({ myPartener })
      })
      .catch(error => {
        react.props.dispatch(handleError(error))
      })
    }

    document.ontouchmove = function (evt) {
      evt.preventDefault();
    }

  }

  componentWillUnmount() {
    // You have to remove ontouchmove listener otherwise you can not scroll on other page
    document.ontouchmove = null
  }

  handleAvatarChange(e) {
    var file = e.target.files[0]

    if (file) {
      if (/^image\//i.test(file.type)) {
        this.readFile(file)
      } else {
        alert('Not a valid image!')
      }
    }
  }

  readFile(file) {

    var react = this
    var reader = new FileReader()

    reader.onloadend = function () {
      var formData = new FormData()
      formData.append('file', file)
      const fileDa = file
      api.uploadBusinessCard(formData)
        .then(data => {
          react.props.dispatch(hideLoading())
          const parsedData = react.parseData(JSON.parse(data))
          const image = reader.result
          const file = fileDa
          const state = { ...parsedData, image, file }
          react.props.history.push(api.baseUrl + '/add_investor', state)
        }).catch(error => {
          console.error(error)
          react.props.dispatch(hideLoading())
          const image = reader.result
          const file = fileDa
          const state = { image, file }
          react.props.history.push(api.baseUrl + '/add_investor', state)
        })
    }

    reader.onerror = function () {
      alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
    react.props.dispatch(requestContents(''))
  }

  parseData(data) {
    const name = data.formatted_name ? data.formatted_name[0].item : null
    const email = data.email ? data.email[0].item : null
    let title
    if (data.title) {
      const index = this.props.titles.map(item => item.titleName).indexOf(data.title[0].item)
      if (index > -1) {
        title = this.props.titles[index].id
      }
    }
    let mobile
    if (data.telephone) {
      const mobileArr = data.telephone.filter(f => /1[34578]\d{9}/.exec(f.item.number))
      if (mobileArr.length > 0) {
        mobile = /1[34578]\d{9}/.exec(mobileArr[0].item.number)[0]
      }
    }
    let company = null
    if (data.organization) {
      const companyObj = data.organization[0].item
      company = companyObj.name || companyObj.positional || companyObj.unit
    }
    return { name, email, title, mobile, company }
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

    const rightContent = this.props.userInfo.userType === 3 ? (
      <div style={avatarContainerStyle}>
        <img style={iconStyle} src={api.baseUrl + "/images/plus.png"} alt="" />
        <div style={inputContainerStyle}>
          <input style={inputStyle} id="file" name="upfile" type="file" accept="image/*" onChange={this.handleAvatarChange} />
        </div>
      </div>
    ) : null

var loadmoreStyle = {
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
  transformOrigin: '0px 0px 0px',
  opacity: 1,
  transform: 'scale(1, 1)'
}

  loadmoreStyle.visibility = this.state.isLoadingMore ? 'visible' : 'hidden'

    return (
      <div>

        <NavigationBar
          title={this.props.userInfo.userType === 1 ? "我的交易师" : "我的投资人"}
          rightContent={rightContent} />

        <div className="pull_refresh" id="pull_refresh">

          <div className="pull">
            <div id="arrow" className="arrow">
              <img src={api.baseUrl + '/images/ic_arrow_down.svg'} alt="" /><br />
            </div>
          </div>

          <div className="loading">
            <img src={api.baseUrl + '/images/loading.svg'} alt="" />
          </div>

        </div>

        {/*<div style={floatContainerStyle}>
          {content}
        </div>*/}

        <div id="wrapper1">
          <div id="scroller">
            <ul id="list" ref="listContainer" style={{ overflow: 'auto' }}>
              { content }
            </ul>
            <div className="loading-more" style={loadmoreStyle}><img style={loadingStyle} src={api.baseUrl + '/images/loading.svg'} alt="" /></div>
          </div>
        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  const { userInfo, titles } = state
  return { userInfo, titles, userType: userInfo.userType }
}

export default connect(mapStateToProps)(MyPartener)

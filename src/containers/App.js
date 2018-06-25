import React, { Component } from 'react'
import ProjectListCell from '../components/ProjectListCell'
import Modal from '../components/Modal'
import { connect } from 'react-redux'
import { updateProjectStructure, requestContents, receiveContents, appendProjects, handleError, saveRedirectUrl } from '../actions'
import TabBar from './TabBar'
import Transform from '../transform'
import AlloyTouch from 'alloytouch'
import { Link } from 'react-router-dom'
import api from '../api.js'
import * as newApi from '../api3.0.js'

const inWxApp = window.__wxjs_environment === 'miniprogram';

const loadingStyle = {
  width: '20px'
}

const headerLabelStyle = {
  float: 'left',
  marginLeft: '14px'
}

const headerActionStyle = {
  float: 'right',
  marginRight: '14px',
}

const headerLabelSpanStyle = {
  padding: '0px 7px',
  borderLeft: '2px solid #10458F',
  verticalAlign: 'middle'
}

const headerIconStyle = {
  width: '14px',
  height: '15px',
  marginRight: '7px',
  verticalAlign: 'middle'
}

const headerActionDoStyle = {
  verticalAlign: 'middle',
  color: '#666666'
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = { isLoadingMore: false, showEmail: false, isLoadingAll: false }
    this.showEmailModal = this.showEmailModal.bind(this)
    this.hideEmailModal = this.hideEmailModal.bind(this)
  }

  showEmailModal() {
    this.setState({ showEmail: true })
  }

  hideEmailModal() {
    this.setState({ showEmail: false })
  }

  convertIntToArray(start, length) {
    const array = []
    for (var i = start; i < (start + length); i++) {
      array.push(i)
    }
    return array
  }
  intersectArray(array1, array2) {
    const result = []
    array1.forEach(item => {
      if (array2.includes(item)) {
        result.push(item)
      }
    })
    return result
  }
  getPublicAndNotMarketPlaceProjects = (skipCount, maxSize) => newApi.getProj(
    Object.assign(
      filterToObject(this.props.filter),
      {
        projstatus: 4,
        ismarketplace: false,
        skip_count: skipCount,
        max_size: maxSize,
      },
    )
  )
  getPublicAndMarketPlaceProjects = (skipCount, maxSize) => newApi.getProj(
    Object.assign(
      filterToObject(this.props.filter),
      {
        projstatus: 4,
        ismarketplace: true,
        skip_count: skipCount,
        max_size: maxSize,
      },
    )
  )
  getClosedAndNotMarketPlaceProjects = (skipCount, maxSize) => newApi.getProj(
    Object.assign(
      filterToObject(this.props.filter),
      {
        projstatus: 8,
        ismarketplace: false,
        skip_count: skipCount,
        max_size: maxSize,
      },
    )
  )
  getClosedAndMarketPlaceProjects = (skipCount, maxSize) => newApi.getProj(
    Object.assign(
      filterToObject(this.props.filter),
      {
        projstatus: 8,
        ismarketplace: true,
        skip_count: skipCount,
        max_size: maxSize,
      },
    )
  )
  getProjectsArray = [
    this.getPublicAndNotMarketPlaceProjects,
    this.getPublicAndMarketPlaceProjects,
    this.getClosedAndNotMarketPlaceProjects,
    this.getClosedAndMarketPlaceProjects,
  ]

  getProjects = callback => {

    const count = []
    let newArray = []
    this.getPublicAndNotMarketPlaceProjects(0, 1)
    .then(data => {
      count.push(data.count);
      return this.getPublicAndMarketPlaceProjects(0, 1);
    })
    .then(data => {
      count.push(data.count);
      return this.getClosedAndNotMarketPlaceProjects(0, 1);
    })
    .then(data => {
      count.push(data.count);
      return this.getClosedAndMarketPlaceProjects(0, 1);
    })
    .then(data => {
      count.push(data.count);
      newArray = count.reduce((acc, val) => {
        var startIndex = 0
        if (acc.length > 0) {
          for (var a = acc.length - 1; a >= 0; a--) {
            var startArr = acc[a]
            if (startArr.length > 0) {
              startIndex = startArr[startArr.length - 1]
              break
            }
          }
        }
        acc.push(this.convertIntToArray(startIndex + 1, val))
        return acc
      }, [])
      const intersect = newArray.map(item => this.intersectArray(item, this.convertIntToArray(1, 10)))
      const requestArr = []
      intersect.forEach((item, index) => {
        if (item.length > 0) {
          requestArr.push(this.getProjectsArray[index](item[0] - newArray[index][0], item.length))
        }
      })
      return Promise.all(requestArr)
    })
    .then(result => {
      const projects = result.map(item => item.data).reduce((acc, val) => acc.concat(val), []).map(item => {
        var obj = {}
        obj['id'] = item.id
        obj['title'] = item.projtitle
        obj['amount'] = item.financeAmount_USD
        obj['country'] = item.country.country
        obj['currency'] = item.currency.id
        obj['amount_cny'] = item.financeAmount
        obj['imgUrl'] = item.industries[0].url
        obj['industrys'] = item.industries.map(i => i.name)
        obj['isMarketPlace'] = item.ismarketplace
        return obj
      })
      callback(projects, newArray);
    })
    .catch(error => this.props.dispatch(handleError(error)))
  }

  getMoreProjects = callback => {
    const intersect = this.props.projectStructure.map(item => this.intersectArray(item, this.convertIntToArray(this.props.projects.length + 1, 10)))
    const requestArr = []
    intersect.forEach((item, index) => {
      if(item.length > 0) {
        requestArr.push(this.getProjectsArray[index](item[0] - this.props.projectStructure[index][0], item.length))
      }
    })
    if (requestArr.length === 0) {
      requestArr.push(this.getClosedAndMarketPlaceProjects(10000, 10))
    }
    Promise.all(requestArr)
      .then(result => {
        const projects = result.map(item => item.data).reduce((acc, val) => acc.concat(val), []).map(item => {
          var obj = {}
          obj['id'] = item.id
          obj['title'] = item.projtitle
          obj['amount'] = item.financeAmount_USD
          obj['country'] = item.country.country
          obj['currency'] = item.currency.id
          obj['amount_cny'] = item.financeAmount 
          obj['imgUrl'] = item.industries[0].url
          obj['industrys'] = item.industries.map(i => i.name)
          obj['isMarketPlace'] = item.ismarketplace
          return obj
        })
        callback(projects)
      })
      .catch(error => this.props.dispatch(handleError(error)))
  }

  componentDidMount() {
    if (this.props.projects.length === 0 || this.props.needRefresh) {
      this.props.dispatch(requestContents(''))
      this.getProjects((projects, dataStructure) => {
        this.props.dispatch(updateProjectStructure(dataStructure))
        this.props.dispatch(receiveContents('', projects))
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
      touch: "#wrapper",//反馈触摸的dom
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
        const projectID = evt.target.dataset.id
        if (!projectID) return
        const isMarketPlace = evt.target.dataset.isMarketPlace
        if (!this.props.isLogin) {
          if (inWxApp && window.wx) {
            window.wx.miniProgram.switchTab({url: '/pages/user/user'})
          } else {
            this.props.dispatch(saveRedirectUrl(`${api.baseUrl}/project/detail?projectID=${projectID}&isMarketPlace=${isMarketPlace}`));
            this.props.history.push(api.baseUrl + '/login');
          }
          return;
        }
        if (isMarketPlace == "false") {
          newApi.getShareToken(projectID)
            .then(token => {
              window.location.href = api.baseUrl + '/project/' + projectID + '?token=' + token
            })
            .catch(error => {
              react.props.dispatch(handleError(error))
            })
        } else {
          newApi.getProjLangDetail(projectID)
            .then(data => {
              const fileUrl = data.linkpdfurl
              const userInfo = react.props.userInfo
              const email = (userInfo && userInfo.emailAddress) ? userInfo.emailAddress : 'deal@investarget.com'
              const url = '/pdf_viewer.html?file=' + encodeURIComponent(fileUrl) + '&watermark=' + encodeURIComponent(email)
              window.location.href = url
            })
            .catch(error => {
              react.props.dispatch(handleError(error))
            })
        }

      }
    })
    
    function resetMin() {
      const result = -1 * parseInt(getComputedStyle(scroller).height, 10) + window.innerHeight - 45 - 48
      alloyTouch.min = result < 0 ? result : 0
    }

    function loadMore() {
      react.setState({ isLoadingMore: true })
      react.getMoreProjects(projects => {
        // use setTimeout here to prevent load more execute more than once
        setTimeout(() => {
          react.setState({ isLoadingMore: false })
          resetMin()
          if (projects.length > 0) {
            react.props.dispatch(appendProjects(projects))
          } else {
            alloyTouch.to(alloyTouch.min + 50, 0)
            react.setState({ isLoadingAll: true });
          }
          loading = false
        }, 1000)
      })
    }

    function mockRequest(at) {
      pull_refresh.classList.add("refreshing");
      react.setState({ isLoadingAll: false });
      react.getProjects((projects, dataStructure) => {
        arrow.classList.remove("arrow_up");
        pull_refresh.classList.remove("refreshing");
        at.to(at.initialValue);
        react.props.dispatch(updateProjectStructure(dataStructure))
        react.props.dispatch(receiveContents('', projects))
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

  render() {
    var self = this
    var rows = []
    this.props.projects.forEach(function(element) {
      rows.push(
        <div className="margin-bottom-2" key={element.id}>
          <ProjectListCell
            isMarketPlace={element.isMarketPlace}
            title={element.title}
            country={element.country}
            industrys={element.industrys.join('')}
            imgUrl={element.imgUrl}
            amount={element.amount}
            amountCNY={element.amount_cny}
            currency={element.currency}
            id={element.id}
            showEmail={self.showEmailModal} />
        </div>
      )
    }, this)

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

        <div id="header">
          <div style={headerLabelStyle}>
            <span style={headerLabelSpanStyle}>项目推荐</span>
          </div>
          <Link to={api.baseUrl + "/filter"}>
            <div style={headerActionStyle}>
              <img style={headerIconStyle} src={api.baseUrl + '/images/home/filter@2x.png'} alt="" />
              <span style={headerActionDoStyle}>筛选</span>
            </div>
          </Link>
        </div>

        <div id="wrapper" style={inWxApp ? {bottom: 0} : null}>
          <div id="scroller">
            <ul id="list" ref="listContainer">
              { !this.props.isFetching && rows.length === 0 ? <div style={{textAlign: 'center'}}>没有结果，请重新筛选</div> : rows }
            </ul>
            { this.state.isLoadingAll ? 
              <div style={loadmoreStyle}><span style={{ fontSize: 12, color: 'gray' }}>---没有更多了---</span></div> :
              <div className="loading-more" style={loadmoreStyle}><img style={loadingStyle} src={api.baseUrl + '/images/loading.svg'} alt="" /></div>
            }
          </div>
        </div>

        <TabBar />

        <Modal show={this.state.showEmail} title="邮箱" content="sidu.he@investarget.com" actions={[{name: '确定', handler: this.hideEmailModal}]} />

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { projects, needRefresh, userInfo, isFetching, projectStructure, isLogin } = state
  const filter = state.trueFilter
  return { projects, filter, needRefresh, userInfo, isFetching, projectStructure, isLogin }
}

function filterToParams(data) {
  var params = ''

  const countryIdsArr = data.filter(item => item.type === 'area').map(item => item.id)
  if(countryIdsArr.length > 0) {
    params = params + '&input.countryIds=' + countryIdsArr.join(',')
  }

  const industryIdsArr = data.filter(item => item.type === 'industry').map(item => item.id)
  if(industryIdsArr.length > 0) {
    params = params + '&input.industryIds=' + industryIdsArr.join(',')
  }

  const tagIdsArr = data.filter(item => item.type === 'tag').map(item => item.id)
  if(tagIdsArr.length > 0) {
    params = params + '&input.tagIds=' + tagIdsArr.join(',')
  }

  const titleArr = data.filter(item => item.type === 'title').map(item => item.title)
  if (titleArr.length > 0) {
    params = params + '&input.title=' + titleArr[0]
  }

  return params
}

function filterToObject(data) {
  const country = data.filter(item => item.type === 'area').map(item => item.id)
  const industries = data.filter(item => item.type === 'industry').map(item => item.id)
  const tags = data.filter(item => item.type === 'tag').map(item => item.id)
  const search = data.filter(item => item.type === 'title').map(item => item.title)[0]
  return { country, industries, tags, search }
}

export default connect(mapStateToProps)(App);
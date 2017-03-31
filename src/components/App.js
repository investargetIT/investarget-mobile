import React, { Component } from 'react'
import ProjectListCell from './ProjectListCell'
import { connect } from 'react-redux'
import { requestContents, receiveContents, appendProjects, handleError } from '../actions'
import TabBar from './TabBar'
import Transform from '../transform'
import AlloyTouch from 'alloytouch'
import { Link } from 'react-router-dom'
import api from '../api.js'

var loadmoreStyle = {
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
  display: 'block',
  transformOrigin: '0px 0px 0px',
  opacity: 1,
  transform: 'scale(1, 1)'
}

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

  componentDidMount() {

    if (this.props.projects.length === 0) {
      this.props.dispatch(requestContents(''))
      api.getProjects(
        projects => this.props.dispatch(receiveContents('', projects)),
        error => this.props.dispatch(handleError(error))
      )
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
        if (value <= this.min + 5 && !loading) {
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
          return false;
        }
      }
    })

    function resetMin() {
      alloyTouch.min = -1 * parseInt(getComputedStyle(scroller).height) + window.innerHeight - 45 - 48;
    }

    function loadMore() {

      api.getProjects(
        projects => {
          loading = false
          resetMin()
          if (projects.length > 0) {
            react.props.dispatch(appendProjects(projects))
          } else {
            alloyTouch.to(alloyTouch.min + 50)
            react.props.dispatch(handleError(new Error('没有结果')))
          }
        },
        error => react.props.dispatch(handleError(error)),
        react.props.projects.length
      )

    }

    function mockRequest(at) {

      pull_refresh.classList.add("refreshing");

      api.getProjects(
        projects => {
          arrow.classList.remove("arrow_up");
          pull_refresh.classList.remove("refreshing");
          at.to(at.initialValue);
          react.props.dispatch(receiveContents('', projects))
        },
        error => react.props.dispatch(handleError(error))
      )
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

    var rows = []
    this.props.projects.forEach(function(element) {
      rows.push(
        <ProjectListCell
          title={element.title}
          country={element.country}
          industrys={element.industrys.join('')}
          imgUrl={element.imgUrl}
          amount={element.amount}
          key={element.title} />
      )
    }, this)

    return (
      <div>

        <div className="pull_refresh" id="pull_refresh">

          <div className="pull">
            <div id="arrow" className="arrow">
              <img src="images/ic_arrow_down.svg" alt="" /><br />
            </div>
          </div>

          <div className="loading">
            <img src="images/loading.svg" />
          </div>

        </div>

        <div id="header">
          <div style={headerLabelStyle}>
            <span style={headerLabelSpanStyle}>项目推荐</span>
          </div>
          <Link to="/filter">
            <div style={headerActionStyle}>
              <img style={headerIconStyle} src="images/home/filter@2x.png" />
              <span style={headerActionDoStyle}>筛选</span>
            </div>
          </Link>
        </div>

        <div id="wrapper">
          <div id="scroller">
            <ul id="list" ref="listContainer">
              {rows}
            </ul>
            <div className="loading-more" style={loadmoreStyle}><img style={loadingStyle} src="images/loading.svg" /></div>
          </div>
        </div>

        <TabBar />

      </div>
    )
  }
}

function mapStateToProps(state) {
  const projects = state.projects
  return {projects}
}

export default connect(mapStateToProps)(App);

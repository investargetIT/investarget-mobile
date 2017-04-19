import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading, setRecommendProjects } from '../actions'
import { connect } from 'react-redux'
import ProjectListCell from '../components/ProjectListCell'
import { Link } from 'react-router-dom'
import SwipeCell from '../components/SwipeCell'

const contentContainerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px',
  paddingTop: '2px'
}

const emptyPicStyle = {
  display: 'block',
  width: '30%',
  margin: '30px auto'
}

const cellContainerStyle = {
  position: 'relative',
  overflow: 'hidden',

}
const cellWrapStyle = {
  marginLeft: '40px',
  width: '100%',
}
const checkboxWrapStyle = {
  position: 'absolute',
  zIndex: '1',
  top: '0',
  left: '0',
  width: '40px',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: '#fff',
}
const checkboxWrapHideStyle = Object.assign({}, checkboxWrapStyle, {
  display: 'none',
})
const checkboxStyle = {
  display: 'block',
  width: '24px',
  height: '24px',
  backgroundImage: 'url(/images/ht-cellnormal@2x.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}
const checkboxCheckedStyle = Object.assign({}, checkboxStyle, {
  backgroundImage: 'url(/images/ht-cellselected@2x.png)',
})
const coverStyle = {
  position: 'absolute',
  zIndex: '1',
  top: '0',
  left: '40px',
  width: '100%',
  height: '100%',
}
const coverHideStyle = Object.assign({}, coverStyle, {
  display: 'none',
})
const actionWrapStyle = {
  position: 'fixed',
  zIndex: '1',
  left: '0',
  bottom: '0',
  width: '100%',
}
const actionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#10458f',
  color: '#fff',
}
const actionWrapHideStyle = Object.assign({}, actionStyle, {
  display: 'none',
})
const actionButtonStyle = {
  width: '50%',
  height: '44px',
  textAlign: 'center',
  lineHeight: '44px',
  fontSize: '16px',
}
const actionLineStyle = {
  width: '1px',
  height: '24px',
  backgroundColor: '#fff',
}


function arrayRemove(array, item) {
  var _array = array.slice()
  var index = _array.findIndex(i => i == item)
  _array.splice(index, 1)
  return _array
}

function arrayAdd(array, item) {
  var _array = array.slice()
  _array.push(item)
  return _array
}


class MyFavoriteProject extends Component {

  constructor(props) {
    super(props)

    this.state = {
      projects: [],
      isSelecting: false,
      isInitialCellPosition: true,
    }

    this.showSelect = this.showSelect.bind(this)
    this.cancelSelect = this.cancelSelect.bind(this)
    this.confirmSelect = this.confirmSelect.bind(this)

    this.handleCellPositionChange = this.handleCellPositionChange.bind(this)

    this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
  }

  handleCellPositionChange() {
    this.setState({ isInitialCellPosition: false })
  }

  showSelect() {
    this.setState({
      isSelecting: true,
      isInitialCellPosition: true
    })
  }

  toggleSelect(id) {
    var projectIds = this.props.recommendProcess.projectIds
    var _ids = projectIds.includes(id) ?
                arrayRemove(projectIds, id) :
                arrayAdd(projectIds, id)
    this.props.dispatch(setRecommendProjects(_ids))
  }

  cancelSelect() {
    this.setState({
      isSelecting: false
    })
    this.props.dispatch(setRecommendProjects([]))
  }

  confirmSelect() {
    this.setState({
      isSelecting: false
    })
    var projectIds = this.props.recommendProcess.projectIds
    var investorIds = this.props.recommendProcess.investorIds
    if (investorIds.length > 0 && projectIds.length > 0) {
      this.recommend()
    } else if (projectIds.length > 0) {
      this.props.history.push('/select_investors')
    }
  }

  recommend() {
    alert('recommend')
  }

  handleBackIconClicked() {
    this.props.history.goBack()
  }

  componentDidMount() {
    this.props.dispatch(requestContents(''))
    api.getFavoriteProjects(
      {
        'input.userId': api.getCurrentUserId(),
        'input.ftypes': '3',
        'input.maxResultCount': 10,
        'input.skipCount': 0,
      },
      favoriteProjects => {
        this.props.dispatch(hideLoading())
        this.setState({ projects: favoriteProjects })
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  removeFavoriteProject(id) {
    this.setState({
      projects: this.state.projects.filter(item => item.id !== id)
    })
    api.projectCancelFavorite(id)
  }

  render() {
    const content = this.state.projects.map(project =>
      <div className="margin-bottom-2" key={project.id}>
        <div style={cellContainerStyle}>
          <div style={this.state.isSelecting ? cellWrapStyle : {}}>
            <SwipeCell delete={this.removeFavoriteProject.bind(this, project.id)} action="取消收藏" actionBackgroundColor="#276CD2" isInitialPosition={this.state.isInitialCellPosition} onPositionChange={this.handleCellPositionChange} >
              <Link to={"/project/" + project.id} >
                <ProjectListCell
                  title={project.title}
                  country={project.country}
                  industrys={project.industrys.join('')}
                  imgUrl={project.imgUrl}
                  amount={project.amount}
                  id={project.id} />
              </Link>
            </SwipeCell>
          </div>
          <div style={ this.state.isSelecting ? checkboxWrapStyle : checkboxWrapHideStyle } onClick={this.toggleSelect.bind(this, project.id)}>
            <span style={ this.props.recommendProcess.projectIds.includes(project.id) ? checkboxCheckedStyle : checkboxStyle }></span>
          </div>
          {/*遮罩层，防止被用户拖动*/}
          <div style={ this.state.isSelecting ? coverStyle: coverHideStyle }></div>
        </div>
      </div>
    )

    return (
      <div>
        <NavigationBar title="我收藏的项目" backIconClicked={this.handleBackIconClicked} action="推荐" onActionButtonClicked={this.showSelect} />
        <div style={contentContainerStyle}>
          {this.state.projects.length > 0 ? content : <img style={emptyPicStyle} src="/images/emptyBox@2x.png" />}
        </div>
        <div style={ this.state.isSelecting ? actionWrapStyle : actionWrapHideStyle }>
          <div style={actionStyle}>
            <div style={actionButtonStyle} onClick={this.cancelSelect}>取消</div>
            <div style={actionLineStyle}></div>
            <div style={actionButtonStyle} onClick={this.confirmSelect}>确定</div>
          </div>
        </div>
      </div>
    )
    
  }

}

function mapStateToProps(state) {
  const { recommendProcess } = state
  return {
    recommendProcess
  }
}


export default connect(mapStateToProps)(MyFavoriteProject)
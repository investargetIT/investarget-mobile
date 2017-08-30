import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { connect } from 'react-redux'
import { requestContents, hideLoading, handleError, setRecommendInvestors } from '../actions'
import { Link } from  'react-router-dom'
import EmptyBox from '../components/EmptyBox'


var containerStyle = {
    backgroundColor: '#f4f4f4',
    minHeight: '100%',
}
var scrollStyle = {
    width: '100%',
    height: '50px',
    overflowX: 'scroll',
    backgroundColor: '#fff',
    marginBottom: '2px',
}
var tabsStyle = {
    width: '400px',
    height: '50px',
    backgroundColor: '#fff',
}
var tabStyle = {
    margin: '0 10px',
    display: 'block',
    float: 'left',
    width: '80px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    color: '#333',
    fontSize: '16px',
}
var activeTabStyle = Object.assign({}, tabStyle, {
    borderBottom: '2px solid #10458F',
    color: '#10458F',
});

var iconStyle = {
    width: '28px',
    height: '28px',
    verticalAlign: 'middle',
}

var projectListStyle = {}

class Chat extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: 'interest', // 'favorite', 'recommend', 'system'
            projects: []
        }

        this.handleActionButtonClicked = this.handleActionButtonClicked.bind(this)
    }

    selectTab(tab) {
        this.setState({
            activeTab: tab,
        })
        var map = {
            'interest': 5,
            'favorite': 4,
            'recommend': 3,
            'system': 1
        }
        var ftype = map[tab]

        this.getFavoriteProjects(ftype)
    }

    getFavoriteProjects(ftype) {

        this.props.dispatch(requestContents(''))

        var userType = this.props.userType
        var userId = this.props.userId
        var targetUserId = this.props.match.params.id
        var investorId = userType == 1 ? userId : targetUserId
        var traderId = userType == 1 ? targetUserId : userId

        var param = {
            page_size: 10,
            page_index: 1,
            favoritetype: ftype
        }
        
        if (ftype == 1) {
            param['user'] = investorId
        } else if (ftype == 3) {
            param['user'] = investorId
            param['trader'] = traderId
        } else if (ftype == 4) {
            param['user'] = investorId
        } else if (ftype == 5) {
            param['user'] = investorId
            param['trader'] = traderId
        }

        newApi.getFavoriteProj(param)
            .then(data => {
                const projects = data.data.map(item => utils.convertFavoriteProject(item.proj))
                this.setState({ projects })
                this.props.dispatch(hideLoading())
            })
            .catch(error => {
                this.props.dispatch(handleError(error))
            })

    }

    handleActionButtonClicked() {
        this.props.history.push(api.baseUrl + '/my_favorite_project')
    }

    componentDidMount() {
        if (this.props.userType === 3) {
            var investorId = this.props.match.params.id
            this.props.dispatch(setRecommendInvestors([investorId]))
        }
        this.selectTab(this.state.activeTab)
    }

    render() {
        var tabNameMap = {}
        if (this.props.userType === 1) {
            tabNameMap = {
                'interest': '感兴趣', 'favorite': '我的收藏', 'recommend': '交易师推荐', 'system': '系统推荐',
            }
        } else if (this.props.userType === 3) {
            tabNameMap = {
                'interest': 'Ta感兴趣', 'favorite': 'Ta的收藏', 'recommend': '推荐Ta的', 'system': '系统推荐',
            }
        }

        return (
            <div style={containerStyle}>
                { this.props.userType === 3
                    ? (
                        <NavigationBar title={this.props.location.state.name}
                                       backIconClicked={this.props.history.goBack}
                                       action={ <img style={iconStyle} src={api.baseUrl + '/images/plus.png'}></img> }
                                       onActionButtonClicked={this.handleActionButtonClicked} />
                    )
                    : (
                        <NavigationBar title={this.props.location.state.name}
                                       backIconClicked={this.props.history.goBack} />
                    )
                }

                <div style={scrollStyle}>
                    <div style={tabsStyle}>
                        {
                            ['interest', 'favorite', 'recommend', 'system'].map(tab => (
                                <span key={tab}
                                      style={this.state.activeTab == tab ? activeTabStyle : tabStyle}
                                      onClick={this.selectTab.bind(this, tab)}>{tabNameMap[tab]}</span>
                            ))
                        }
                    </div>
                </div>
                <div style={projectListStyle}>
                    {
                        this.state.projects.length ?
                            this.state.projects.map(
                                (project) => (
				  <a className="margin-bottom-2" key={project.id} href={api.baseUrl + '/project/' + project.id + (this.props.userInfo ? '?token=' + this.props.userInfo.token : '')}>
                                        <ProjectListCell
                                            title={project.title}
                                            country={project.country}
                                            industrys={project.industrys.join('')}
                                            imgUrl={project.imgUrl}
                                            amount={project.amount}
                                            id={project.id}
                                        />
                                    </a>
                                )
                            ) :
                            <EmptyBox />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { userInfo } = state
    return {
        userId: userInfo.id,
      userType: userInfo.userType,
      userInfo
    }
}

export default connect(mapStateToProps)(Chat)

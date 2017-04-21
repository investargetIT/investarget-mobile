import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
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
            'interest': 4,
            'favorite': 3,
            'recommend': 1,
            'system': 0
        }
        var ftype = map[tab]

        this.getFavoriteProjects(ftype)
    }

    getFavoriteProjects(ftype) {
        var userId
        if (this.props.userType === 1) {
            userId = this.props.userId
        } else if (this.props.userType === 3) {
            userId = this.props.match.params.id
        }
        var ftypes = [ftype]
        this.props.dispatch(requestContents(''))
        api.getFavoriteProjects(
            {
                'input.maxResultCount': 10,
                'input.skipCount': 0,
                'input.userId': userId,
                'input.ftypes': ftypes.join(',')
            },
            (projects) => {
                this.setState({ projects: projects })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    handleActionButtonClicked() {
        this.props.history.push('/my_favorite_project')
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
                        <NavigationBar title={this.props.location.state.investorName}
                                       backIconClicked={this.props.history.goBack}
                                       action="+"
                                       onActionButtonClicked={this.handleActionButtonClicked} />
                    )
                    : (
                        <NavigationBar title={this.props.location.state.investorName}
                                       backIconClicked={this.props.history.goBack} />
                    )
                }

                <div style={scrollStyle}>
                    <div style={tabsStyle}>
                        {
                            ['interest', 'favorite', 'recommend', 'system'].map(tab => (
                                <span style={this.state.activeTab == tab ? activeTabStyle : tabStyle}
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
                                    <Link className="margin-bottom-2" key={project.id} to={'/project/' + project.id}>
                                        <ProjectListCell
                                            title={project.title}
                                            country={project.country}
                                            industrys={project.industrys.join('')}
                                            imgUrl={project.imgUrl}
                                            amount={project.amount}
                                            id={project.id}
                                        />
                                    </Link>
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
        userType: userInfo.userType
    }
}

export default connect(mapStateToProps)(Chat)
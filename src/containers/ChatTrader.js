import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { connect } from 'react-redux'
import { requestContents, hideLoading, handleError } from '../actions'

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
}
var activeTabStyle = Object.assign({}, tabStyle, {
    borderBottom: '2px solid #10458F',
    color: '#10458F',
});

var projectListStyle = {}

class ChatTrader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'recommend', // 'recommend', 'favorite'
            projects: []
        }
    }

    selectTab(tab) {
        this.setState({ activeTab: tab })
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
        var userId = api.getCurrentUserId()
        var ftypes = [ftype]
        var param = {
            'input.maxResultCount': 10,
            'input.skipCount': 0,
            'input.userId': userId,
            'input.ftypes': ftypes.join(',')
        }
        this.props.dispatch(requestContents(''))
        api.getFavoriteProjects(
            param,
            (projects) => {
                this.setState({ projects: projects })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    componentDidMount() {
        this.selectTab(this.state.activeTab)
    }

    render() {
        return (
            <div style={containerStyle}>
                <NavigationBar title={this.props.location.state.transactionName} backIconClicked={this.props.history.goBack} />
                <div style={scrollStyle}>
                    <div style={tabsStyle}>
                        <span style={this.state.activeTab == 'recommend' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'recommend')}>交易师推荐</span>
                        <span style={this.state.activeTab == 'favorite' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'favorite')}>我的收藏</span>
                    </div>
                </div>
                <div style={projectListStyle}>
                    {
                        this.state.projects.map(project => (
                            <div className="margin-bottom-2" key={project.title}>
                                <ProjectListCell
                                    title={project.title}
                                    country={project.country}
                                    industrys={project.industrys.join('')}
                                    imgUrl={project.imgUrl}
                                    amount={project.amount}
                                    id={project.id}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default connect()(ChatTrader)
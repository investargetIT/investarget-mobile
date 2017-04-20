import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { connect } from 'react-redux'
import { requestContents, hideLoading, handleError, setRecommendInvestors } from '../actions'
import { Link } from  'react-router-dom'


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

class ChatInvestor extends React.Component {
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
        var ftypes = [ftype]
        this.props.dispatch(requestContents(''))
        api.getFavoriteProjects(
            {
                'input.maxResultCount': 10,
                'input.skipCount': 0,
                'input.userId': this.props.match.params.id,
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
        var investorId = this.props.match.params.id
        this.props.dispatch(setRecommendInvestors([investorId]))
        this.selectTab(this.state.activeTab)
    }

    render() {

        return (
            <div style={containerStyle}>
                <NavigationBar title={this.props.location.state.investorName}
                               backIconClicked={this.props.history.goBack}
                               action="+"
                               onActionButtonClicked={this.handleActionButtonClicked} />
                <div style={scrollStyle}>
                    <div style={tabsStyle}>
                        <span style={this.state.activeTab == 'interest' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'interest')}>Ta感兴趣</span>
                        <span style={this.state.activeTab == 'favorite' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'favorite')}>Ta的收藏</span>
                        <span style={this.state.activeTab == 'recommend' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'recommend')}>推荐Ta的</span>
                        <span style={this.state.activeTab == 'system' ? activeTabStyle : tabStyle} onClick={this.selectTab.bind(this, 'system')}>系统推荐</span>
                    </div>
                </div>
                <div style={projectListStyle}>
                    {
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
                        )
                    }
                </div>
            </div>
        )
    }
}

export default connect()(ChatInvestor)
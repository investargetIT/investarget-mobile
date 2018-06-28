import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'
import PickerView from '../components/PickerView'
import PlainTable, {PlainTableButton} from '../components/PlainTable'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { connect } from 'react-redux'
import { requestContents, hideLoading, handleError, setRecommendInvestors } from '../actions'
import { Link } from  'react-router-dom'
import EmptyBox from '../components/EmptyBox'

const inWxApp = newApi.inWxApp;

var containerStyle = {
    backgroundColor: '#f4f4f4',
    minHeight: '100%',
}
var scrollStyle = {
    width: '100%',
    height: '50px',
    overflowX: 'scroll',
    overflowY: 'hidden',
    backgroundColor: '#fff',
    marginBottom: '2px',
}
var tabsStyle = {
    width: '400px',
    height: '50px',
    backgroundColor: '#fff',
    display: 'inline-block',
}
var tabStyle = {
    margin: '0 10px',
    display: 'inline-block',
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

var pickerViewWrapStyle = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
}

var projectListStyle = {}

class Chat extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: 'userinfo', //'interest', 'favorite', 'recommend', 'system'
            projects: [],
            pageType: 0,
            userInfo: [],
            showPickerView: false,
            transactionStatus: null,
            famlv: 0,
            famOptions: null,
        }

        this.relation = null;
        this.handleActionButtonClicked = this.handleActionButtonClicked.bind(this)
    }

    getTraders = investor => {
        const param = { investoruser: investor}
        newApi.getUserRelation(param).then(result => {
            const data = result.data.sort((a, b) => Number(b.relationtype) - Number(a.relationtype))
            this.relation = data.filter(f => f.traderuser.id === this.props.userInfo.id)[0];
            this.setState({ famlv: this.relation.familiar, transactionStatus: this.relation.familiar});
        
        })
        newApi.getSource('famlv').then(data => {
            const famOptions = data.map(item => ({ name: item.name, value: item.id }));
            this.setState({ famOptions });
        });
    }

    selectTab(tab) {
        this.setState({
            activeTab: tab,
        })
        var map = {
            'userinfo': 0,
            'interest': 5,
            'favorite': 4,
            'recommend': 3,
            'system': 1
        }
        var ftype = map[tab]

        this.props.dispatch(requestContents(''))
        if ([1,3,4,5].includes(ftype)) this.getFavoriteProjects(ftype)
        else this.showPage(ftype)
    }

    showPage(pageType) {
        switch (pageType) {
            case 0:
                let userId = this.props.match.params.id
                let nameMap = {}
                newApi.getUserDetail(userId).then(result => {
                    nameMap.电话 = result.mobile ? `+${result.mobileAreaCode}-${result.mobile}` : "暂无"
                    nameMap.邮箱 = result.email || "暂无"
                    nameMap.职位 = result.title && result.title.nameC || "暂无"
                    nameMap.标签 = result.tags ? result.tags.map(v=>v.nameC).join(",") : "暂无"
                    nameMap.微信 = result.wechat || "暂无"
                    nameMap.机构 = result.org && result.org.orgfullname || "暂无"
                    if (this.props.userInfo.permissions.includes('usersys.as_trader')) {
                        newApi.getUserRelation({ investoruser: userId }).then(investresult => {
                            let score = (this.state.famOptions || [{}]).filter(i => this.state.famlv === i.value)[0]
                            nameMap.交易师 = (investresult.data || []).map(v => v.traderuser.username).join(",")
                            nameMap.熟悉程度 = <PlainTableButton onClick={this.handleModifyTransactionStatus.bind(this)}>{score && score.name || "暂无"}</PlainTableButton>
                            this.setState({ userInfo: Object.entries(nameMap) })
                            this.props.dispatch(hideLoading())
                        })
                    } else {
                        this.setState({ userInfo: Object.entries(nameMap) })
                        this.props.dispatch(hideLoading()) 
                    }
                })
                break;
            default: this.props.dispatch(hideLoading()); break;
        }
        this.setState({pageType})
    }

    getFavoriteProjects(ftype) {

        var userType = this.props.userType
        var userId = this.props.userId
        var targetUserId = this.props.match.params.id
        var isInvestor = userType === 1

        var param = {
            page_size: 10,
            page_index: 1,
            favoritetype: ftype
        }
        
        if (ftype == 1) {
            param['user'] = targetUserId
        } else if (ftype == 3) {
            if (isInvestor) {
                param['trader'] = targetUserId
            } else {
                param['user'] = targetUserId
            }
        } else if (ftype == 4) {
            if (!isInvestor) {
                param['user'] = targetUserId
            }
        } else if (ftype == 5) {
            if (isInvestor) {
                param['trader'] = targetUserId
            } else {
                param['user'] = targetUserId
            }
        }

        newApi.getFavoriteProj(param)
            .then(data => {
                const projects = data.data
                    .filter(item => item.proj != null)
                    .map(item => utils.convertFavoriteProject(item.proj))
                this.setState({ projects, pageType: 1 })
                this.props.dispatch(hideLoading())
            })
            .catch(error => {
                this.props.dispatch(handleError(error))
            })

    }

    handleActionButtonClicked() {
        this.props.history.push(api.baseUrl + '/my_favorite_project')
    }

    handleClickProject = (id) => {
        newApi.getShareToken(id)
            .then(token => {
                if (inWxApp && window.wx) {
                    window.wx.miniProgram.navigateTo({ url: `/pages/dtil/dtil?pid=${id}&token=${token}` });
                } else {
                    window.location.href = api.baseUrl + '/project/' + id + '?token=' + token
                }
            })
            .catch(error => {
                this.props.dispatch(handleError(error))
            })
    }

    handleModifyTransactionStatus() {
        this.setState({ showPickerView: true, transactionStatus: this.state.famlv })
    }

    handleTransactionStatusChange(value) {
        this.setState({ transactionStatus: value })
    }

    handleModifyTransactionStatusCancel() {
        this.setState({ showPickerView: false, transactionStatus: this.state.famlv })
    }

    handleModifyTransactionStatusConfirm() {

        let value = this.state.transactionStatus
        const { investoruser, traderuser, relationtype, id } = this.relation;
        newApi.editUserRelation([{ 
            id, 
            traderuser: traderuser.id, 
            investoruser: investoruser.id, 
            relationtype, 
            familiar: value 
        }]);
        this.setState({ famlv: value, showPickerView: false, transactionStatus: value })
        let score = (this.state.famOptions || [{}]).filter(i => value === i.value)[0]
        let userInfo = this.state.userInfo.map(v => v[0] === "熟悉程度" ? ["熟悉程度", <PlainTableButton onClick={this.handleModifyTransactionStatus.bind(this)}>{score && score.name || "暂无"}</PlainTableButton>] : v)
        this.setState({ userInfo })
    }

    componentDidMount() {
        if (this.props.userInfo.permissions.includes('usersys.as_trader')) {
            if (this.props.userId) this.getTraders(this.props.match.params.id)
        }
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
                'userinfo': '个人信息', 'interest': '感兴趣', 'favorite': '我的收藏', 'recommend': '交易师推荐', 'system': '系统推荐',
            }
        } else if (this.props.userType === 3) {
            tabNameMap = {
                'userinfo': '个人信息', 'interest': 'Ta感兴趣', 'favorite': 'Ta的收藏', 'recommend': '推荐Ta的', 'system': '系统推荐',
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
                    <div style={{...tabsStyle, width: Object.keys(tabNameMap).length * 100}}>
                        {
                            ['userinfo', 'interest', 'favorite', 'recommend', 'system'].map(tab => (
                                <span key={tab}
                                      style={this.state.activeTab == tab ? activeTabStyle : tabStyle}
                                      onClick={this.selectTab.bind(this, tab)}>{tabNameMap[tab]}</span>
                            ))
                        }
                    </div>
                </div>
                <div style={projectListStyle}>
                    {
                        this.state.pageType === 0 ?
                            <PlainTable data={this.state.userInfo}/>
                            : this.state.projects.length ?
                                this.state.projects.map(
                                    (project) => (
                                        <div className="margin-bottom-2" key={project.id} onClick={this.handleClickProject.bind(this, project.id)}>
                                            <ProjectListCell
                                                title={project.title}
                                                country={project.country}
                                                industrys={project.industrys.join('')}
                                                imgUrl={project.imgUrl}
                                                amount={project.amount}
                                                id={project.id}
                                            />
                                        </div>
                                    )
                                ) :
                                <EmptyBox />
                    }
                </div>
                { this.state.famOptions ? 
                    <div style={pickerViewWrapStyle}>
                        <PickerView show={this.state.showPickerView}
                                    title="熟悉程度"
                                    options={this.state.famOptions}
                                    value={this.state.transactionStatus}
                                    onValueChange={this.handleTransactionStatusChange.bind(this)}
                                    onCancel={this.handleModifyTransactionStatusCancel.bind(this)}
                                    onConfirm={this.handleModifyTransactionStatusConfirm.bind(this)}>
                        </PickerView>
                    </div>
                : null }
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
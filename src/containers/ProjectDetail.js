import React from 'react'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { handleError, requestContents, hideLoading, setRecommendProjects, clearRecommend, showToast, hideToast, saveRedirectUrl } from '../actions'
import { connect } from 'react-redux'
import NavigationBar from '../components/NavigationBar'
import Modal from '../components/Modal'
import { Link } from 'react-router-dom'

const inWxApp = newApi.inWxApp;

var containerStyle = {
    minHeight: '100%',
    backgroundColor: '#f4f4f4',
}
var firstStyle = {
    position: 'absolute',
    bottom: '0',
    padding: '15px 0',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.3)',
}
var titleStyle = {
    fontSize: '14px',
}
var tagStyle = {
    marginTop: '10px',
    fontSize: '12px',
}
var dateStyle = {
    marginTop: '10px',
    fontSize: '12px',
}
var fyStyle = {
    marginRight: '5px',
}
var dataSetStyle = {
    padding: '10px 20px',
    background: '#f4f4f4',
    borderBottom: '1px solid #ccc',
}
var dataTitleStyle = {
    fontSize: '16px',
    fontWeight: '400',
    marginBottom: '5px',
}
var dataEntryStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '.25em',
    marginBottom: '.25em',
    fontSize: '12px',
}
var dataKeyStyle = {
    flexShrink: '0',
    letterSpacing: '2px',
    paddingLeft: '10px',
    marginRight: '50px',
    width: '80px',
    textAlign: 'right',
}
var dataValueStyle = {
    flexGrow: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}
var spanStyle = {
    marginRight: '5px',
}

var highlightStyle = {
    
}
var highlightTitleStyle = {
    backgroundColor: '#e3b0a8',
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    lineHeight: '2em',
    margin: '10px 0',
}
var highlightContentStyle = {
    fontSize: '12px',
    textAlign: 'justify',
    lineHeight: '2em',
    paddingLeft: '8px',
}

const actionContainerStyle = {
  position: 'fixed',
  height: '40px',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex'
}

const actionStyle = {
  flex: 1,
  backgroundColor: '#10458F',
  border: 'none',
  color: 'white',
  fontSize: '15px'
}

const actionFavoriteContinerStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '0px',
  right: '0px',
  width: '40px',
  margin: 'auto'
}

const favoriteIconStyle = {
    width: '40px'
}

const actionPlaceHolderStyle = {
    height: '40px',
}


const guideWrapperStyle = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    zIndex: '99',
    width: '100%',
}
const guidePlaceholderStyle = {
    width: '100%',
    height: '48px',
}
const guideStyle = {
    display: 'flex',
    width: '100%',
    height: '48px',
    alignItems: 'center',
    padding: '0 12px',
    backgroundColor: '#fff',
    boxShadow: '0 -1px 1px rgba(0,0,0,.1), 0 -2px 2px rgba(255,255,255,.3)',
}
const guideCloseStyle = {
    width: '20px',
    height: '20px',
    marginRight: '10px',
}
const guideLogoStyle = {
    width: '40px',
    height: '40px',
    marginRight: '10px',
}
const guideTextStyle = {
    flexGrow: '1',
}
const guideTitleStyle = {
    fontSize: '16px',
    marginBottom: '2px',
}
const guideContentStyle = {
    fontSize: '12px',
    color: '#999',
}
const guideLinkStyle = {
}
const guideButtonStyle = {
    color: '#333',
    fontSize: '12px',
    lineHeight: '28px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    padding: '0 1em',
    borderRadius: '4px',
}


class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = { 
            "result": null,
            "isMyFavoriteProject": false,
            "favorId": null,
            "showModal": false,
            "modalTitle": "",
            "modalContent": "",
            "modalActions": [],
            "showGuide": false,
        }

        this.favorProject = this.favorProject.bind(this)
        this.unfavorProject = this.unfavorProject.bind(this)
        this.handleFavoriteButtonToggle = this.handleFavoriteButtonToggle.bind(this)
        this.handleActionButtonClicked = this.handleActionButtonClicked.bind(this)
        this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
        this.handleRecommendSuccess = this.handleRecommendSuccess.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.handleCloseGuide = this.handleCloseGuide.bind(this)
    }

    recommend() {
        var userId = api.getCurrentUserId()
        var investorIds = this.props.recommendProcess.investorIds
        var projectIds  = this.props.recommendProcess.projectIds

        var sequence = Promise.resolve()

        this.props.dispatch(requestContents(''))
        investorIds.forEach(investorId => {
            sequence = sequence.then(() => {
                var param = {
                    user: investorId,
                    projs: projectIds,
                    favoritetype: 3,
                    trader: userId,
                }
                return newApi.projFavorite(param)
            }) 
        })

        sequence
        .then(
            items => {
                this.props.dispatch(hideLoading())
                this.props.dispatch(setRecommendProjects([]))
                this.setState({
                    showModal: true,
                    modalTitle: '通知',
                    modalContent:  '推荐成功',
                    modalActions: [{name: '确定', handler: this.handleRecommendSuccess}]
                })
            }
        )
        .catch(
            error => {
                this.props.dispatch(handleError(error))
                this.props.dispatch(setRecommendProjects([]))
            }
        )
    }

    handleRecommendSuccess() {
        this.setState({ showModal: false })
        if (!inWxApp) this.props.history.goBack()
    }

    componentDidMount() {
      var urlTokenArr = /token=([^&]+)(&|$)/.exec(this.props.location.search)
      if (!urlTokenArr || urlTokenArr.length < 2) {
        this.props.dispatch(saveRedirectUrl(this.props.location.pathname))
        this.props.history.push(api.baseUrl + '/login')
        return
      }

      var projectId = parseInt(this.props.match.params.id)
      this.props.dispatch(setRecommendProjects([projectId]))

      this.props.dispatch(requestContents(''))

      var projectId = this.props.match.params.id

      const token = urlTokenArr[1]
      newApi.getShareProj(token)
        .then(data => {
            const project = utils.convertDetailProject(data)
            if (inWxApp && window.wx) window.wx.miniProgram.postMessage({data: project}); 
            this.props.dispatch(hideLoading())
            document.title = project.titleC
            this.setState({ result: project })
        })
        .catch(error => {
            this.props.dispatch(handleError(error))
        })
      

      // 是否收藏了项目
      if (this.props.isLogin) {
        const param = {
            favoritetype: 4,
            proj: projectId,
        }
        newApi.getFavoriteProj(param)
            .then(data => {
                const favorData = data.data
                const isFavorite = favorData.length == 1
                const favorId = favorData[0] && favorData[0].id
                this.setState({
                    isMyFavoriteProject: isFavorite,
                    favorId,
                })
            })
            .catch(error => {
                this.props.dispatch(handleError(error))  
            })
      } else {
          this.setState({ showGuide: true })
      }
      
    }


    favorProject(projectId) {
        const userId = utils.getCurrentUserId()
        const param = {
            favoritetype: 4,
            user: userId,
            projs: [projectId]
        }
        newApi.projFavorite(param)
            .then(data => {
                const favorId = data[0].id

                this.setState({
                    isMyFavoriteProject: true,
                    favorId: favorId,
                    showModal: true,
                    modalTitle: '通知',
                    modalContent: '收藏成功',
                    modalActions: [{name: '确定', handler: this.hideModal}]
                })
            })
            .catch(error => {
                //
            })
    }

    unfavorProject(id) {
        const param = { favoriteids: [id] }
        newApi.projCancelFavorite(param)
            .then(data => {
                this.setState({
                    isMyFavoriteProject: false,
                    favorId: null,
                })
                this.props.dispatch(showToast('取消收藏成功'))
                setTimeout(() => {
                    this.props.dispatch(hideToast())
                }, 2000)
            })
            .catch(error =>  {
                //
            })
    }

    handleFavoriteButtonToggle() {
        var projectId = this.props.match.params.id
        
        if (this.state.isMyFavoriteProject) {
            this.unfavorProject(this.state.favorId)
        } else {
            this.favorProject(projectId)
        }
    }

    hideModal() {
        this.setState({ showModal: false })
    }

    handleActionButtonClicked(event) {
        switch (event.target.name) {
	        case "timeline":
                var toObj = {
                pathname: api.baseUrl + '/timeline/' + this.props.match.params.id,
                state: this.state.result.titleC
                }
                this.props.history.push(toObj)
                break
            case "recommend":
                if (this.state.isMyFavoriteProject) {
                    if (this.props.recommendProcess.projectIds.length &&
                        this.props.recommendProcess.investorIds.length)
                    {
                        this.recommend()
                    } else if (this.props.recommendProcess.projectIds.length) {
                        this.props.history.push(api.baseUrl + '/select_user')
                    }
                } else {
                    this.setState({
                        showModal: true,
                        modalTitle: '通知',
                        modalContent: '您还未收藏该项目，请先收藏',
                        modalActions: [{name: '确定', handler: this.hideModal}]
                    })
                }
                break
            case "interest":
                if (this.props.recommendProcess.projectIds.length &&
                    this.props.recommendProcess.investorIds.length) {
                    this.recommend()
                } else if (this.props.recommendProcess.projectIds.length) {
                    this.props.history.push(api.baseUrl + '/select_user')
                }
        }
    }

    handleBackIconClicked() {
      this.props.dispatch(setRecommendProjects([]))
      if (this.props.history.length > 1) {
	this.props.history.goBack()
    this.timer = setTimeout(() => {
        this.props.history.push(api.baseUrl + '/')
    }, 100)
      } else {
	window.location.href = api.baseUrl + '/'
      }
    }

    handleCloseGuide() {
        this.setState({ showGuide: false })
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {


      if (!this.state.result) {
        return null
      }

        var info = this.state.result
        info.creationTime = info.creationTime.split("T")[0]

        var bgImageStyle = {
            position: 'relative',
            paddingBottom: '10px',
            width: '100%',
            height: '220px',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        bgImageStyle.backgroundImage = 'url(' + encodeURI(info.industrys[0].imgUrl) + ')'


        var itemMap = {
            'targetMarketC': '目标市场',
            'productTechnologyC': '核心产品',
            'businessModelC': '商业模式',
            'brandSalesChannelC': '品牌渠道',
            'managementC': '管理团队',
            'partnersC': '商业伙伴',
            'useofProceedC': '资金用途',
            'financingRecordC': '融资历史',
            'operatingFiguresC': '经营数据',
            'b_introducteC': '项目简介',
        }
        var hightlightItems = Object.keys(info.projectFormat)
            .filter(item => {
                return item.endsWith('C')
            }).map(item => {
                if (info.projectFormat[item]) {
                    return (
                        <div style={highlightStyle} key={item}>
                            <p style={highlightTitleStyle}><span>{ itemMap[item] }</span></p>
                            <p style={highlightContentStyle} dangerouslySetInnerHTML={{ __html: changeToEnter(info.projectFormat[item]) }}></p>
                        </div>
                    )
                } else {
                    return null;
                }
            })
        

      var wechatImageContainer = {
	    display: 'none'
      }
        return (
	        <div style={containerStyle}>
                <div style={wechatImageContainer}> 
                    <img src={encodeURI(info.industrys[0].imgUrl)} alt="" />
                </div>

                <NavigationBar title="项目详情" backIconClicked={this.handleBackIconClicked} hideBack={inWxApp}/>

                <div style={bgImageStyle}>
                    <div style={firstStyle}>
                        <p style={titleStyle} >{ info.titleC }</p>
                        <p style={tagStyle} >标签：{ info.tags.map(tag => <span style={spanStyle} key={tag.id}>{tag.tagName}</span>) } </p>
                        <p style={dateStyle} >发布日期：{info.creationTime}</p>
		            </div>
                </div>

                <div style={dataSetStyle}>
                    <h4 style={dataTitleStyle}>公司基本信息</h4>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>所属行业 </label>
                        <span style={dataValueStyle}>
                            { info.industrys.map(industry => <span style={spanStyle} key={industry.id}>{ industry.industryName }</span>) }
                        </span>
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>项目地区 </label>
                        <span style={dataValueStyle}>{ info.country.countryName }</span>
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>交易类型 </label>
                        <span style={dataValueStyle}>
                            { info.transactionTypes.map(transactionType => <span style={spanStyle} key={transactionType.id}>{ transactionType.name }</span>) }
                        </span>
                    </div>
                </div>

                <div style={dataSetStyle}>
                    <h4 style={dataTitleStyle}>财务指标摘录</h4>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>净利润 </label>
                        { 
                            info.financeIsPublic ? 
                            <span style={dataValueStyle}>
                                {info.finances && info.finances.length > 0 && info.finances[0].fYear ? <span style={fyStyle}>FY{ info.finances[0].fYear }</span> : ''}
                                {
                                    info.country.id !== 42 || info.currencyType.id !== 1 ? 
                                    info.finances && info.finances.length > 0 && info.finances[0].netIncome_USD ? '$' + moneySplit(info.finances[0].netIncome_USD) : 'N/A' : 
                                    info.finances && info.finances.length > 0 && info.finances[0].netIncome ? '¥' + moneySplit(info.finances[0].netIncome) : 'N/A'
                                }
                            </span> : 
                            <span style={dataValueStyle}>未公开</span>
                        }
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>营业收入 </label>
                        {
                            info.financeIsPublic ?
                            <span style={dataValueStyle}>
                                {info.finances && info.finances.length > 0 && info.finances[0].fYear ? <span style={fyStyle}>FY{ info.finances[0].fYear }</span> : ''}
                                {
                                    info.country.id !== 42 || info.currencyType.id !== 1 ? 
                                    info.finances && info.finances.length > 0 && info.finances[0].revenue_USD ? '$' + moneySplit(info.finances[0].revenue_USD) : 'N/A' : 
                                    info.finances && info.finances.length > 0 && info.finances[0].revenue ? '¥' + moneySplit(info.finances[0].revenue) : 'N/A'
                                }
                            </span> :
                            <span style={dataValueStyle}>未公开</span>
                        }
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>交易规模 </label>
                        <span style={dataValueStyle}>
                            { 
                                info.country.id !== 42 || info.currencyType.id !== 1 ? 
                                info.financedAmount_USD ? '$' + moneySplit(info.financedAmount_USD) : 'N/A' :
                                info.financedAmount ? '¥' + moneySplit(info.financedAmount) : 'N/A'
                            }
                        </span>
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>公司估值</label>
                        <span style={dataValueStyle}>
                            { 
                                info.country.id !== 42 || info.currencyType.id !== 1 ? 
                                info.companyValuation_USD ? '$' + moneySplit(info.companyValuation_USD) : 'N/A' :
                                info.companyValuation ? '¥' + moneySplit(info.companyValuation) : 'N/A'
                            }
                        </span>
                    </div>
                </div>

                <div style={dataSetStyle}>
                    <h4 style={dataTitleStyle}>项目亮点</h4>
                    {hightlightItems}
                </div>

		        { this.props.isLogin ? 
                    <div>
                        <div style={actionPlaceHolderStyle}></div>
                        <div style={actionContainerStyle}>
                            <button name="timeline" style={actionStyle} onClick={this.handleActionButtonClicked}>时间轴</button>
                            {
                                this.props.userInfo.userType == 1 ? 
                                    <button name="interest" style={actionStyle} onClick={this.handleActionButtonClicked}>感兴趣</button> :
                                    <button name="recommend" style={actionStyle} onClick={this.handleActionButtonClicked}>推荐给投资人</button>
                            }
                            
                            <div style={actionFavoriteContinerStyle}>
                                <img
                                    style={favoriteIconStyle}
                                    src={api.baseUrl + (this.state.isMyFavoriteProject ? "/images/home/projCollected@2x.png" : "/images/home/projNoCollect@2x.png")}
                                    onClick={this.handleFavoriteButtonToggle}
                                />
                            </div>
                        </div>
                    </div>
                :
                    <div style={{ display: this.state.showGuide ? 'block' : 'none' }}>
                        <div style={guidePlaceholderStyle}></div>
                        <div style={guideWrapperStyle}>
                            <div style={guideStyle}>
                                <img style={guideCloseStyle} onClick={this.handleCloseGuide} src={api.baseUrl + "/images/closeView@2x.png"} alt="close"></img>
                                <img style={guideLogoStyle} src={api.baseUrl + "/images/shareLogo@2x.png"} alt="logo"></img>
                                <div style={guideTextStyle}>
                                    <p style={guideTitleStyle}>多维海拓</p>
                                    <p style={guideContentStyle}>中国跨境投资生态系统</p>
                                </div>
                                <Link style={guideLinkStyle} to={api.baseUrl + "/register"}>
                                    <button style={guideButtonStyle}>立即注册</button>
                                </Link>
                            </div> 
                        </div>
                    </div>
                }

                <Modal show={this.state.showModal} title={this.state.modalTitle} content={this.state.modalContent} actions={this.state.modalActions} />
            </div>
        )
    }
}


// utils
function moneySplit(money){
    if(money){
        money = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return money;
}

var reg = new RegExp("\\n", "g");
function changeToEnter(text) {
    if (text) {
        text = text.replace(reg, "<br>");
        return text;
    }
}

function mapStateToProps(state) {
  const { isLogin, userInfo, recommendProcess } = state
  return { isLogin, userInfo, recommendProcess }
}

export default connect(mapStateToProps)(ProjectDetail)

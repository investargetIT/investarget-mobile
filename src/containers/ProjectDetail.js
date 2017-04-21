import React from 'react'
import api from '../api'
import { handleError, requestContents, hideLoading, setRecommendProjects, clearRecommend } from '../actions'
import { connect } from 'react-redux'
import NavigationBar from '../components/NavigationBar'
import Modal from '../components/Modal'

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
    backgroundColor: '#303133'
}

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = { 
            "result": null,
            "isMyFavoriteProject": false,
            "showModal": false,
            "modalTitle": "",
            "modalContent": "",
            "modalActions": [],
        }

        this.handleFavoriteButtonToggle = this.handleFavoriteButtonToggle.bind(this)
        this.handleActionButtonClicked = this.handleActionButtonClicked.bind(this)
        this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
        this.handleRecommendSuccess = this.handleRecommendSuccess.bind(this)
        this.hideModal = this.hideModal.bind(this)
    }

    recommend() {
        var userId = api.getCurrentUserId()
        var investorIds = this.props.recommendProcess.investorIds
        var projectIds  = this.props.recommendProcess.projectIds
        var all = []

        this.props.dispatch(requestContents(''))
        investorIds.forEach(investorId => {
            projectIds.forEach(projectId => {
                all.push(new Promise((resolve, reject) => {
                    var param = {
                        userId: investorId,
                        projectId: projectId,
                        fType: 1,
                        transactionId: userId,
                    }
                    api.favoriteProject(
                        param,
                        () => resolve(),
                        error => reject(error)
                    )
                }))
            })
        })

        Promise.all(all)
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
        this.props.history.goBack()
    }

    componentDidMount() {

      if (!this.props.match.params.token) {
        this.props.history.push('/login')
        return
      }

      var projectId = this.props.match.params.id
      this.props.dispatch(setRecommendProjects([projectId]))

      this.props.dispatch(requestContents(''))

      var projectId = this.props.match.params.id
      const token = this.props.match.params.token
      api.getSingleProject(
        projectId,
        data => {
	  this.props.dispatch(hideLoading())
	  document.title = data.titleC
          this.setState({ result: data }
        )},
	error => this.props.dispatch(handleError(error)),
	token
      )

      // 是否收藏了项目
      if (!this.props.isLogin) return
      api.getFavoriteProjectIds(
        {
            'input.projectId': projectId,
            'input.userId': api.getCurrentUserId(),
            'input.ftypes': '3'
        },
        projectIds => {
            this.setState({
                isMyFavoriteProject: (projectIds.length == 1)
            })
        },
        error => this.props.dispatch(handleError(error))
      )
      
    }

    handleFavoriteButtonToggle() {
      var projectId = this.props.match.params.id
      var param = {
          userId: api.getCurrentUserId(),
          projectId: projectId,
          fType: 3
      }

      this.state.isMyFavoriteProject ?
        api.projectCancelFavorite(param, ()=>{}, error=>{}) :
        api.favoriteProject(param, ()=>{}, error=>{})
        
      this.setState({
        isMyFavoriteProject: !this.state.isMyFavoriteProject
      })
      if (!this.state.isMyFavoriteProject) {
          this.setState({
              showModal: true,
              modalTitle: '通知',
              modalContent: '收藏成功',
              modalActions: [{name: '确定', handler: this.hideModal}]
          })
      }
    }

    hideModal() {
        this.setState({ showModal: false })
    }

    handleActionButtonClicked(event) {
        switch (event.target.name) {
	        case "timeline":
                var toObj = {
                pathname: '/timeline/' + this.props.match.params.id,
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
                        this.props.history.push('/select_user')
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
                    this.props.history.push('/select_user')
                }
        }
    }

    handleBackIconClicked() {
        this.props.dispatch(setRecommendProjects([]))
        this.props.history.goBack()
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
            backgroundImage: 'url("../img/background_detail.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
        }
        bgImageStyle.backgroundImage = 'url(' + info.industrys[0].imgUrl + ')'


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
	        <div>
                <div style={wechatImageContainer}> 
                    <img src={info.industrys[0].imgUrl} alt="" />
                </div>

                <NavigationBar title="项目详情" backIconClicked={this.handleBackIconClicked}/>

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
                                {info.finances[0].fYear ? <span style={fyStyle}>FY{ info.finances[0].fYear }</span> : ''}
                                {info.finances.netIncome_USD ? '$' + moneySplit(info.finances[0].netIncome_USD) : 'N/A'}
                            </span> : 
                            <span style={dataValueStyle}>未公开</span>
                        }
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>营业收入 </label>
                        {
                            info.financeIsPublic ?
                            <span style={dataValueStyle}>
                                {info.finances[0].fYear ? <span style={fyStyle}>FY{ info.finances[0].fYear }</span> : ''}
                                {info.finances[0].revenue_USD ? '$' + moneySplit(info.finances[0].revenue_USD) : 'N/A' }
                            </span> :
                            <span style={dataValueStyle}>未公开</span>
                        }
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>交易规模 </label>
                        <span style={dataValueStyle}>
                            { info.financedAmount_USD ? '$' + moneySplit(info.financedAmount_USD) : 'N/A' }
                        </span>
                    </div>

                    <div style={dataEntryStyle}>
                        <label style={dataKeyStyle}>公司估值</label>
                        <span style={dataValueStyle}>
                            { info.companyValuation_USD ? '$' + moneySplit(info.companyValuation_USD) : 'N/A' }
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
                                this.props.userInfo.userType == 1 ? (
                                    <button name="interest" style={actionStyle} onClick={this.handleActionButtonClicked}>感兴趣</button>
                                ) : null
                            }
                            {
                                this.props.userInfo.userType == 3 ? (
                                    <button name="recommend" style={actionStyle} onClick={this.handleActionButtonClicked}>推荐给投资人</button>
                                ) : null
                            }
                            
                            <div style={actionFavoriteContinerStyle}>
                                <img
                                    style={favoriteIconStyle}
                                    src={this.state.isMyFavoriteProject ? "/images/home/projCollected@2x.png" : "/images/home/projNoCollect@2x.png"}
                                    onClick={this.handleFavoriteButtonToggle}
                                />
                            </div>
                        </div>
                    </div>
                : null }

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

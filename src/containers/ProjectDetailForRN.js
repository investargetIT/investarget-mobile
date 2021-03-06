import React from 'react'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { handleError, requestContents, hideLoading, setRecommendProjects, clearRecommend, showToast, hideToast, saveRedirectUrl } from '../actions'
import { connect } from 'react-redux'
import NavigationBar from '../components/NavigationBar'
import Modal from '../components/Modal'
import { Link } from 'react-router-dom'

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


class ProjectDetailForRN extends React.Component {
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
            "userToken": null,
            "email": 'Investarget',
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
        this.props.history.goBack()
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
            this.props.dispatch(hideLoading())
            document.title = project.titleC
            this.setState({ result: project })
        })
        .catch(error => {
            this.props.dispatch(handleError(error))
        })

      const userTokenArr = /userToken=([^&]+)(&|$)/.exec(this.props.location.search);
      if (userTokenArr && userTokenArr.length > 1) {
          const userToken = userTokenArr[1];
          const emailArr = /email=([^&]+)(&|$)/.exec(this.props.location.search);
          if (emailArr && emailArr.length > 1) {
              const email = emailArr[1];
              this.setState({ userToken, email });
          } else {
              this.setState({ userToken });
          }

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
        bgImageStyle.backgroundImage = 'url(' + info.industrys[0].imgUrl + ')'


        var itemMap = {
            'b_introducteC': '项目简介',
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
	        <div style={containerStyle}>
                <div style={wechatImageContainer}> 
                    <img src={info.industrys[0].imgUrl} alt="" />
                </div>


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

                { this.state.userToken ?
                  <div style={dataSetStyle}>
                    <h4 style={dataTitleStyle}>附件下载</h4>
                    <DownloadFiles projectId={this.props.match.params.id} token={this.state.userToken} email={this.state.email} />
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

export default connect(mapStateToProps)(ProjectDetailForRN)

class DownloadFiles extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        attachments: [],
      }
    }
  
    componentDidMount() {
      const id = this.props.projectId
      newApi.getProjAttWithToken({ proj: id, page_size: 10000 }, this.props.token).then(result => {
        const { data: attachments } = result;
        this.setState({ attachments })
  
        const q = attachments.map(item => {
          let { bucket, key } = item;
        //   key = key + '?attname=' + encodeURIComponent(key);
          return newApi.getdProjAttUrlWithToken(bucket, key, this.props.token).then(result => {
            return '/pdf_viewer.html?file=' +  encodeURIComponent(result) + '&watermark=' + this.props.email;
          })
        })
        Promise.all(q).then(urls => {
          const list = attachments.map((item, index) => {
            return { ...item, url: urls[index] }
          })
          this.setState({ attachments: list })
        })
      })
    }
  
    render() {
      const containerStyle = {
        padding: 10,
      }
      const sectionStyle = {
        padding: '0px 20px',
        paddingTop:'10px',
        marginBottom:10,
        // display: 'flex',
        backgroundColor:'rgb(233, 241, 243)'
      }
  
  
      const titleStyle = {
        flexShrink: 0,
        width: 150,
        paddingRight: 15,
      }
      const listStyle = {
        flexGrow: 1,
      }
      const headerStyle={
        fontSize: 14,
        fontWeight: 400,
        paddingLeft: 120,
        color: '#656565',
        marginBottom:20,
      }
      const imgContainer={
        width:30,
        height:25,
        position:'relative',
      }
      const cloudStyle={
        width:'100%',
        height:'100%',
      }
      const arrowStyle={
        position:'absolute',
        zIndex:1,
        right:'35%',
        top:'20%',
        width:'30%',
        height:'40%',
      }
      const liStyle={
        display:'flex',
        justifyContent:'space-between',
        minHeight:20,
      }

      const dirs = Array.from(new Set(this.state.attachments.map(item=>item.filetype)))
  
      return (
        <div>

          { dirs.length > 0 ? null : <div style={headerStyle}>暂无附件</div> }

          {dirs.map((dir, index) => {
            const files = this.state.attachments.filter(item => item.filetype == dir)
            const isLast = index == dirs.length - 1
 
            
            return (
              <div key={index}>
                <div style={highlightTitleStyle}>{dir}</div>
                <ul style={listStyle}>
                  {files.map(file => {
                    return (
                        <a
                        // disabled={!file.url}
                        // download={file.filename}
                        href={file.url}
                      >
                      <li key={file.key} style={liStyle}>
                        <div title={file.filename} style={{ ...highlightContentStyle, color: '#333' }}>
                          {file.filename}
                        </div>
                        
                      </li>
                      </a>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )
    }
  }

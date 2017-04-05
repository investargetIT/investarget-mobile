import React from 'react'
import api from '../api'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

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

var dataContainerStyle = {
    
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


class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = { "result": null }
    }

    componentDidMount() {

      if (!this.props.isLogin) {
        this.props.history.push('/login')
        return
      }

      this.props.dispatch(requestContents(''))

      api.getSingleProject(
        this.props.match.params.id,
        data => {
          this.props.dispatch(hideLoading())
          this.setState({ result: data }
        )},
        error => this.props.dispatch(handleError(error))
      )
      
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


        return (
            <div>
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

var reg = new RegExp("\n", "g");
function changeToEnter(text) {
    if (text) {
        text = text.replace(reg, "<br>");
        return text;
    }
}

function mapStateToProps(state) {
  const isLogin = state.isLogin
  return { isLogin }
}

export default connect(mapStateToProps)(ProjectDetail)
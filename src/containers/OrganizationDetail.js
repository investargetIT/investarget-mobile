import React from 'react'
import { connect } from 'react-redux'
import { requestContents, handleError, hideLoading } from '../actions'
import api from '../api'

import NavigationBar from '../components/NavigationBar'


var orgStyle = {
    padding: '0px 17px 0',
}
var rowStyle = {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    minHeight: '40px',
}
var leftColStyle = {
    width: '100px',
    flexShrink: '0',
}
var rightColStyle = {
    flexGrow: '1',
    margin: '.5em 0',
    maxHeight: '100px',
    overflow: 'scroll',
}

class OrganizationDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state ={ result: null }
    }

    componentDidMount() {
        this.props.dispatch(requestContents(''))
        api.getSingleOrganization(this.props.match.params.id,
            result => {
                this.props.dispatch(hideLoading())
                this.setState({result: result})
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    render() {
        var orgInfo = this.state.result;

        var orgTypeMap = {
            "1": "基金", "2": "律所", "3": "投行", "4": "会计师事务所", "5": "咨询",
            "6": "证券", "7": "银行", "8": "信托", "9": "租赁", "10": "保险",
            "11": "期货", "12": "上市公司", "13": "新三板上市公司", "14": "非上市公司", "15": "政府引导性基金",
            "16": "金融机构直投基金", "17": "上市公司产业基金", "18": "其他", "19": "个人",
        }

        var currencyMap = {
            "1": "人民币", "2": "美元", "3": "人民币及美元",
        }

        var auditMap = {
            "1": "待审核", "2": "审核通过", "3": "审核退回",
        }

        var fields = orgInfo ? [
            {name: '机构名称', value: orgInfo.name || ''},
            {name: '机构类型', value: orgTypeMap[orgInfo.orgType] || ''},
            {name: '机构行业', value: orgInfo.industry && orgInfo.industry.industryName || ''},
            {name: '交易金额', value: orgInfo.transactionAmountF ? `${orgInfo.transactionAmountF} ~ ${orgInfo.transactionAmountT} ¥` : 'N/A'},
            {name: '交易阶段', value: orgInfo.transactionPhases.map(phase => phase.name).join(' ') || ''},
            {name: '货币类型', value: currencyMap[orgInfo.currency] || ''},
            {name: '基金规模', value: orgInfo.fundSize || 'N/A'},
            {name: '公司官网', value: orgInfo.webSite || ''},
            {name: '审核状态', value: auditMap[orgInfo.auditStatus] || ''},
            {name: '机构描述', value: orgInfo.description || ''},
            {name: '典型投资案例', value: orgInfo.typicalCase || ''},
            {name: '合伙人/投委会成员', value: orgInfo.partnerOrInvestmentComitteeMember || ''},
            {name: '决策流程', value: orgInfo.decisionMakingProcess || ''},
        ] : []

        return (
            <div>
                <NavigationBar title="机构信息" backIconClicked={this.props.history.goBack} />
                <div style={orgStyle}>
                    {
                        fields.map((field,index) => {
                            return (
                                <div style={rowStyle} key={index}>
                                    <span style={leftColStyle}>{field.name}</span>
                                    <span style={rightColStyle}>{field.value}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}



export default connect()(OrganizationDetail)
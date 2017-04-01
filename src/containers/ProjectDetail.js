import React from 'react'


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

        // this.state = {"result":{"titleC":"幻彩项目：韩国上市化妆品公司少数股权投资机会","titleE":"Project MULTICOLOR: Minority Investment Opportunity in Korean Public Cosmetics Corporation","realNameC":"","realNameE":"","creationTime":"2016-10-12T11:51:22.833","code":"P201610120003","c_DescriptionC":"","c_DescriptionE":"","b_introducteC":"","b_introducteE":"","character":{"characterC":"项目公司","characterE":"Project company","isDeleted":false,"id":1},"financedAmount":1000000000,"financedAmount_USD":1000000000,"companyValuation":null,"companyValuation_USD":null,"companyYear":2000,"ishidden":false,"financeIsPublic":true,"country":{"areaCode":82,"continentId":4,"countryName":"韩国","url":"https://o79atf82v.qnssl.com/023.jpg","id":32},"currencyType":{"currencyName":"美元","id":2},"contactPerson":"杨帆","phoneNumber":"12-1031657369","eMail":"fyang@samil.com","userId":629,"hasPublicDataRoom":false,"basic_Status":{"statusName":"终审发布","id":4},"projectFormat":{"targetMarketC":"","targetMarketE":"","productTechnologyC":"","productTechnologyE":"","businessModelC":"","businessModelE":"","brandSalesChannelC":"","brandSalesChannelE":"","managementC":"","managementE":"","partnersC":"","partnersE":"","useofProceedC":"","useofProceedE":"","financingRecordC":"","financingRecordE":"","operatingFiguresC":"","operatingFiguresE":""},"projectAttachments":[],"finances":[{"revenue":355303092,"netIncome":13579952,"revenue_USD":355303092,"netIncome_USD":13579952,"ebitda":19690494,"grossProfit":224820875,"totalAsset":216551214,"shareholdersequity":161525734,"operationalCashFlow":0,"grossMerchandiseValue":0,"fYear":2015},{"revenue":381845841,"netIncome":2236449,"revenue_USD":381845841,"netIncome_USD":2236449,"ebitda":10713102,"grossProfit":258802635,"totalAsset":198886676,"shareholdersequity":147724650,"operationalCashFlow":0,"grossMerchandiseValue":0,"fYear":2014},{"revenue":385394943,"netIncome":10969741,"revenue_USD":385394943,"netIncome_USD":10969741,"ebitda":15756548,"grossProfit":262195814,"totalAsset":208023628,"shareholdersequity":146728524,"operationalCashFlow":0,"grossMerchandiseValue":0,"fYear":2013}],"tags":[{"tagName":"日用品","id":43},{"tagName":"时尚","id":45}],"transactionTypes":[{"name":"股权融资","id":2}],"industrys":[{"industryName":"化妆品","pIndustryId":9,"bucket":"image","key":"Web-Project-hzp.png","imgUrl":"https://o79atf82v.qnssl.com/Web-Project-hzp.png","id":26}],"id":123},"targetUrl":null,"success":true,"error":null,"unAuthorizedRequest":false,"__abp":true} 
        this.state = {"result":{"titleC":"风尚项目：\u000b全球最著名的三大时尚电视媒体之一","titleE":"Project MODERN: One of the Most Famous Fashion TV on the World","realNameC":"","realNameE":"","creationTime":"2016-09-30T12:57:13.287","code":"P201609300004","c_DescriptionC":"","c_DescriptionE":"","b_introducteC":"目前全球最大集时尚与生活方式于一体的电视媒体，全球最著名的三大时尚电视媒体之一，世界上第一个也是唯一一个覆盖全球的24小时播放的时尚频道\n公司在时尚电视媒体市场处于绝对领先地位，其业务遍布全球193个国家，拥有5.5亿个家庭用户、1,200万网站关注者，并在超过400万个公共场所播放\n公司拥有25个注册商标，全球超过150个零售商店（预计2020年可达500个），以及50,000个时尚视频\n公司的品牌估值达到6.24亿欧元（Eurobrand,2016）","b_introducteE":"The comapny is the largest TV channel for fashion and lifestyle around the world, one of the top three channels worldwide\nThe company is in an absolutely leading position, with its business in 193 countries, 550 million households, 12 million website followers, and playing in more than 4 million public places \nThe company owns 25 registered trademarks, more than 150 retail stores worldwide (up to 500 in 2020), and 50,000 fashion videos\nThe company's brand valuation is 624 million euros (Eurobrand, 2016)","character":{"characterC":"财务顾问","characterE":"Financial advisor","isDeleted":false,"id":2},"financedAmount":350000000,"financedAmount_USD":350000000,"companyValuation":350000000,"companyValuation_USD":350000000,"companyYear":1997,"ishidden":false,"financeIsPublic":true,"country":{"areaCode":43,"continentId":3,"countryName":"奥地利","url":"https://o79atf82v.qnssl.com/016.jpg","id":24},"currencyType":{"currencyName":"美元","id":2},"contactPerson":"Michal Pelach","phoneNumber":"43-907700015","eMail":"michal@ftv.com","userId":95,"hasPublicDataRoom":false,"basic_Status":{"statusName":"终审发布","id":4},"projectFormat":{"targetMarketC":"","targetMarketE":"","productTechnologyC":"","productTechnologyE":"","businessModelC":"公司收入来源于媒体播放业务、广告业务与授权业务\n电视播放业务的收视率从2013年起每年增长超过30%，内容分发预计每年增长15%；以18个版本在全球播放，提供HD高清、DTH平台及VR等多种播放模式，向用户收取订购费\n线上播放业务除了时尚视频内容外，还提供了28个主题频道，涉及模特、化妆、设计师等模块；同时通过网站可以获得最新的时尚展信息\n广告业务源于电视和网站渠道，电视渠道每小时有9分钟可播放广告，其广告业务的合作伙伴包含CHANEL、VOGUE等知名公司\n授权业务主要涉及服装、饮料、地产和电影行业；服装行业目前在泰国、中国和印尼已有店面，正在东南亚其他国家快速拓展；2010年已经进入酒行业；2013年进入地产及相关行业；电影行业是新的分支，目前已经有第一部电影产出","businessModelE":"The company's revenue comes from TV distribution, advertising and licensing business \nTV distribution has increased more than 30% since 2013; content distribution is expected to grow 15% per year; it is played in 18 editions around the world, providing HD, DTH platforms and VR and other multi-player mode; the company charges the user subscription fee\nIn addition to video content, the online channel provides 28 thematic channels, involving models, makeup, designer and other modules; audience can get the latest information from the website\nAdvertising is based on TV channels and online channel; 9 minutes per hour in television channels can be used for advertising; its advertising partners includes CHANEL, VOGUE and other well-known companies\nLicensing covers clothing, beverages, real estate and film industry; the company has retail shop currently in Thailand, China and Indonesia stores and the stores in other Southeast Asian countries are rapidly expanding; in 2010 the company has entered the wine industry; in 2013 the company has entered the real estate and related industries; film industry is a new branch, there is already first film output","brandSalesChannelC":"","brandSalesChannelE":"","managementC":"","managementE":"","partnersC":"","partnersE":"","useofProceedC":"","useofProceedE":"","financingRecordC":"","financingRecordE":"","operatingFiguresC":"公司2013年收入1,148万欧元；2014年收入1,599万欧元，较上年增长39.3%；2015年收入2,661万欧元，较上年增长66.4%\n根据2014年的收入细分，授权业务占据了45.0%的份额，媒体业务占比30.0%，广告业务份额较小，仅占比4.3%\n公司在YouTube上居于时尚媒体排名首位，其每月2,000万视频浏览量超过了其他所有时尚媒体的总和；在Facebook上关注数超过400万，每月浏览量达2570万，视频浏览量达到1,100万\n公司预计每年产生500小时视频内容，另两大时尚电视媒体预计每年产生120小时的内容","operatingFiguresE":"The company has a revenue of €11.48M in 2013, has a revenue of €15.99M in 2014 and €26.61M in 2015 and has increased 66.4% in compare to 2014\nAccording to 2014 revenue breakdown, licensing accounts for 45.0%, TV distribution accounts for 30.0%, advertising business accounts for a smaller share with only 4.3% \nThe company ranked first in the fashion media on YouTube, its video views of 20 million per month are more than the sum of all other fashion media; on Facebook there are more than 4 million follows and the monthly views reaches 25.7 million and the video views has reached 11 million\nThe company is expected to produce 500 hours of video content per year; the other two top Fashion media is expected to generate 120 hours of content every year"},"projectAttachments":[],"finances":[{"revenue":29772000,"netIncome":15941000,"revenue_USD":29772000,"netIncome_USD":15941000,"ebitda":16546000,"grossProfit":0,"totalAsset":0,"shareholdersequity":0,"operationalCashFlow":0,"grossMerchandiseValue":0,"fYear":2015}],"tags":[{"tagName":"时尚","id":45}],"transactionTypes":[{"name":"兼并收购","id":1}],"industrys":[{"industryName":"媒体广告","pIndustryId":11,"bucket":"image","key":"Web-Project-gg.png","imgUrl":"https://o79atf82v.qnssl.com/Web-Project-gg.png","id":58}],"id":84},"targetUrl":null,"success":true,"error":null,"unAuthorizedRequest":false,"__abp":true}
    }

    render() {
        var info = this.state.result
        info.creationTime = info.creationTime.split("T")[0]

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
                        <div style={highlightStyle}>
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


export default ProjectDetail
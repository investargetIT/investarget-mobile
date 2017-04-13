import React from 'react'
import ProjectListCell from '../components/ProjectListCell'
import NavigationBar from '../components/NavigationBar'

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
            projects: [
                {
                    amount: 1000000,
                    country: "中国",
                    imgUrl: "https://o79atf82v.qnssl.com/Web-project-Hotel food and beverage.png",
                    industrys: ["酒店餐饮"],
                    title: "测试项目007"
                },
                {
                    amount: 1000000000,
                    country: "韩国",
                    imgUrl: "https://o79atf82v.qnssl.com/Web-Project-hzp.png",
                    industrys: ["化妆品"],
                    title: "幻彩项目：韩国上市化妆品公司少数股权投资机会"
                },
            ]
        }

        this.selectTab = this.selectTab.bind(this)
    }


    selectTab(event) {
        var tab = event.target.dataset.id
        this.setState({
            activeTab: tab,
        })
    }

    render() {
        var rows = []
        this.state.projects.forEach(function(element) {
            rows.push(
                <div className="margin-bottom-2" key={element.title}>
                    <ProjectListCell
                        title={element.title}
                        country={element.country}
                        industrys={element.industrys.join('')}
                        imgUrl={element.imgUrl}
                        amount={element.amount}
                    />
                </div>
            )
        }, this)

        return (
            <div style={containerStyle}>
                <NavigationBar title="投资人" backIconClicked={this.props.history.goBack} />
                <div style={scrollStyle}>
                <div style={tabsStyle}>
                    <span style={this.state.activeTab == 'interest' ? activeTabStyle : tabStyle} data-id="interest" onClick={this.selectTab}>Ta感兴趣</span>
                    <span style={this.state.activeTab == 'favorite' ? activeTabStyle : tabStyle} data-id="favorite" onClick={this.selectTab}>Ta的收藏</span>
                    <span style={this.state.activeTab == 'recommend' ? activeTabStyle : tabStyle} data-id="recommend" onClick={this.selectTab}>推荐Ta的</span>
                    <span style={this.state.activeTab == 'system' ? activeTabStyle : tabStyle} data-id="system" onClick={this.selectTab}>系统推送</span>
                </div>
                </div>
                <div style={projectListStyle}>
                    { rows }
                </div>
            </div>
        )
    }
}

export default ChatInvestor
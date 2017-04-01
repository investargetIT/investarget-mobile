import React from 'react'


var containerStyle = {
    height: '100%',
    backgroundImage: 'url(/images/timeline/timeLineBG@2x.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}

var scrollStyle = {
    height: '100%',
    overflowY: 'scroll',
}

var pageStyle = {
    
}
var countStyle = {
    height: '32px',
    backgroundColor: '#fff',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '15px',
    boxShadow: '0 1px 4px 1px rgba(228, 234, 236, 0.5), 0 -1px 4px 1px rgba(228, 234, 236, 0.5)',
}

var timelineStyle = {
    margin: '15px 13px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    padding: '8px 12px 12px',
    boxShadow: '0 0 4px 2px rgba(189, 223, 239, 0.5)',
}

var nameStyle = {
    paddingBottom: '4px',
}
var nameSpanStyle = {
    display: 'inline-block',
    padding: '2px 4px',
    fontSize: '16px',
    textAlign: 'center',
    background: '#10458F',
    color: '#fff',
    borderRadius: '4px',
}

var detailStyle = {
    fontSize: '16px',   
}

var rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '10px',
    paddingBottom: '4px',
    borderBottom: '1px solid #eee',
    color: '#555',
}

var rowNoBorderStyle = Object.assign({}, rowStyle, {
    borderBottom: 'none',
})

var leftColStyle = {
    flexShrink: '0',
}

var rightColStyle = {
    flexGrow: '1',
    overflow: 'hidden',
    maxHeight: '3.9em',
    lineHeight: '1.3em',
}


class TimelineManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {

        var timeline = (
            <div style={timelineStyle}>
                <div style={nameStyle}>
                    <span style={nameSpanStyle}>电眼项目</span>
                </div>
                <div style={detailStyle}>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>投资人：</span>
                        <span style={rightColStyle}>杨海滨</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>投资人所属机构：</span>
                        <span style={rightColStyle}>平安信托直投</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>交易师：</span>
                        <span style={rightColStyle}>赵鹏云</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>当前状态：</span>
                        <span style={rightColStyle}>以获取项目概要</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>是否结束：</span>
                        <span style={rightColStyle}>已结束</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={leftColStyle}>剩余天数：</span>
                        <span style={rightColStyle}>7</span>
                    </div>
                    <div style={rowNoBorderStyle}>
                        <span style={leftColStyle}>最新备注：</span>
                        <span style={rightColStyle}>The proposed time of 14:00, 18th Jan is confirmed. Roy, Toy and Desiry will join the metting.</span>
                    </div>
                </div>
            </div>
        )


        return (
            <div style={containerStyle}>
                <div style={scrollStyle}>
                    <div style={pageStyle}>
                        <div style={countStyle}>
                            时间轴总数：<span>1</span>个
                        </div>
                        {timeline}
                    </div>
                </div>
            </div>
        )
    }
}

export default TimelineManagement
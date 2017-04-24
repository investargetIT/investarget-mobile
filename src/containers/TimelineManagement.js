import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../api'
import { requestContents, hideLoading, handleError } from '../actions'

import NavigationBar from '../components/NavigationBar'


var containerStyle = {
    height: '100%',
    backgroundImage: 'url(' + api.baseUrl + '/images/timeline/timeLineBG@2x.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}

var scrollStyle = {
    overflowY: 'scroll',
    height: `${window.innerHeight - 48}px`,
}

var pageStyle = {
    
}
var countStyle = {
    height: '32px',
    backgroundColor: '#fff',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '18px',
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
    padding: '4px 8px 2px',
    lineHeight: '1.4',
    maxWidth: '100%',
    fontSize: '14px',
    verticalAlign: 'center',
    textAlign: 'center',
    background: '#10458F',
    color: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

var detailStyle = {
    fontSize: '13px',   
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
        this.state = {
            totalCount: 0,
            timelines: [],
            latestRemark: {},
        }
      this.handleGoBack = this.handleGoBack.bind(this)
      this.handleTimelineClicked = this.handleTimelineClicked.bind(this)
    }

    handleGoBack() {
        this.props.history.push('/user')
    }

    componentDidMount() {
        this.props.dispatch(requestContents(''))
        api.getAllTimeLines(
            { 'input.maxResultCount': 100 },
            result => {
                this.setState({
                    totalCount: result.totalCount,
                    timelines: this.state.timelines.concat(result.items),
                })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

  handleTimelineClicked(id) {
    if (this.props.userInfo.userType === 3) {
      this.props.history.push('edit_timeline/' + id)
    }
  }

    render() {
        var userId = api.getCurrentUserId()
        return (
            <div style={containerStyle}>
                <NavigationBar title="项目进程" backIconClicked={this.handleGoBack} />
                <div style={scrollStyle}>
                    <div style={pageStyle}>
                        <div style={countStyle}>
                            时间轴总数：<span>{this.state.totalCount}</span>个
                        </div>
                        {
                            this.state.timelines.map(timeline => (
                                <div style={timelineStyle} key={timeline.timeLineId}>
                                    <Link to={'project/' + timeline.timeLineId}>
                                        <div style={nameStyle}>
                                            <span style={nameSpanStyle}>{timeline.projectName}</span>
                                        </div>
                                    </Link>

                                    <div style={detailStyle}>
                                        <Link to={timeline.investorId == userId ? 
                                            'user_info/' + userId : 
                                            {pathname: 'chat/' + timeline.investorId, state: {name: timeline.investorName}}
                                        }>
                                            <div style={rowStyle}>
                                                <span style={leftColStyle}>投资人：</span>
                                                <span style={rightColStyle}>{timeline.investorName}</span>
                                            </div>
                                        </Link>

                                        <Link to="organization/1466">
                                            <div style={rowStyle}>
                                                <span style={leftColStyle}>投资人所属机构：</span>
                                                <span style={rightColStyle}>{timeline.investorOrg}</span>
                                            </div>
                                        </Link>

                                        <Link to={timeline.transactionId == userId ?
                                            'user_info/' + userId :
                                            {pathname: 'chat/' + timeline.transactionId, state: {name: timeline.transactionName}}
                                        }>
                                            <div style={rowStyle}>
                                                <span style={leftColStyle}>交易师：</span>
                                                <span style={rightColStyle}>{timeline.transactionName}</span>
                                            </div>
                                        </Link>

                                            <div style={rowStyle} onClick={this.handleTimelineClicked.bind(this, timeline.timeLineId)}>
                                                <span style={leftColStyle}>当前状态：</span>
                                                <span style={rightColStyle}>{timeline.transactionStatusName}</span>
                                            </div>

                                        <div style={rowStyle}>
                                            <span style={leftColStyle}>是否结束：</span>
                                            <span style={rightColStyle}>{timeline.isClose ? '已结束' : '未结束'}</span>
                                        </div>

					  <div style={rowStyle} onClick={this.handleTimelineClicked.bind(this, timeline.timeLineId)}>
                                                <span style={leftColStyle}>剩余天数：</span>
                                                <span style={rightColStyle}>{timeline.remainingAlertDays}</span>
                                            </div>

                                            <div style={rowNoBorderStyle} onClick={this.handleTimelineClicked.bind(this, timeline.timeLineId)}>
                                                <span style={leftColStyle}>最新备注：</span>
                                                <span style={rightColStyle}>{timeline.remark}</span>
                                            </div>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { userInfo} = state
  return { userInfo}
}

export default connect(mapStateToProps)(TimelineManagement)

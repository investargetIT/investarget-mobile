import React from 'react'
import NoteModal from '../components/NoteModal'
import SwipeCell from '../components/SwipeCell'
import PickerView from '../components/PickerView'
import NavigationBar from '../components/NavigationBar'

import api from '../api'
import { requestContents, hideLoading, handleError } from '../actions'
import { connect } from 'react-redux'

var containerStyle = {
    fontSize: '14px',
}
var wrapStyle = {
    padding: '0 17px',
    marginBottom: '10px',
}
var rowStyle = {
    paddingTop: '10px',
    borderBottom: '1px solid #f4f4f4',
    display: 'flex',
    lineHeight: '1.4',
}

var colLeftStyle = {
    flexShrink: '0',
    width: '100px',
}

var colRightStyle = {
    flexGrow: '1',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
}

var openModalStyle = {
    color: '#4293ce',
}

var remarksStyle = {
    width: '100%',
}
var remarkWrapStyle = {
    marginBottom: '2px',
}
var remarkStyle = {
    padding: '8px 17px',
    height: '60px',
    backgroundColor: '#f8f9fc',
}

var contentStyle = {
    height: '28px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}
var timeStyle = {
    textAlign: 'right',
    color: '#999',
    fontSize: '12px',
    height: '16px',
}

var pickerViewWrapStyle = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
}

var inputStyle = {
    width: '100%',
    border: 'none',
}


class EditTimeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeLineId: null,
            timeLine: {
                alertCycle: 7,
                transactionStatusId: 0,
            },
            remarks: [],
            remarkDraft: '',
            remarkId: null,
            showAddModal: false,
            showModifyModal: false,
            showPickerView: false,
            transactionStatus: null,
        }

        this.handleAddRemark = this.handleAddRemark.bind(this)
        this.handleAddRemarkCancel = this.handleAddRemarkCancel.bind(this)
        this.handleAddRemarkConfirm = this.handleAddRemarkConfirm.bind(this)

        this.handleRemarkValueChange = this.handleRemarkValueChange.bind(this)        

        this.handleModifyRemark = this.handleModifyRemark.bind(this)
        this.handleModifyRemarkCancel = this.handleModifyRemarkCancel.bind(this)
        this.handleModifyRemarkConfirm = this.handleModifyRemarkConfirm.bind(this)

        this.handleModifyTransactionStatus = this.handleModifyTransactionStatus.bind(this)
        this.handleModifyTransactionStatusCancel = this.handleModifyTransactionStatusCancel.bind(this)
        this.handleModifyTransactionStatusConfirm = this.handleModifyTransactionStatusConfirm.bind(this)

        this.handleTransactionStatusChange = this.handleTransactionStatusChange.bind(this)

        this.handleAlertCycleChange = this.handleAlertCycleChange.bind(this)

        this.handleChangeTimeLine = this.handleChangeTimeLine.bind(this)
    }

    handleAddRemark() {
        this.setState({ showAddModal: true })
    }

    handleAddRemarkCancel() {
        this.setState({ showAddModal: false, remarkDraft: '' })
    }

    handleAddRemarkConfirm() {
        api.createTimeLineRemark(
            { timeLineId: this.state.timeLineId, remark: this.state.remarkDraft },
            (remarks) => {
                this.setState({ showAddModal: false, remarkDraft: '' })

                this.props.dispatch(requestContents(''))
                api.getTimeLineRemarks(
                    this.state.timeLineId,
                    remarks => {
                        this.setState({ remarks: remarks })
                        this.props.dispatch(hideLoading())
                    },
                    error => this.props.dispatch(handleError(error))
                )
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    handleRemarkValueChange(event) {
        var content = event.target.value
        this.setState({ remarkDraft: content })
    }

    handleModifyRemark(remark) {
        this.setState({ showModifyModal: true, remarkId: remark.id, remarkDraft: remark.remark })
    }

    handleModifyRemarkCancel() {
        this.setState({ showModifyModal: false, remarkId: null, remarkDraft: '' })
    }

    handleModifyRemarkConfirm() {
        this.props.dispatch(requestContents(''))  
        api.modifyTimeLineRemark(
            this.state.remarkId,
            { remark: this.state.remarkDraft },
            () => {
                var remarks = this.state.remarks.slice()
                var index = remarks.findIndex(remark => remark.id == this.state.remarkId)
                remarks[index].remark = this.state.remarkDraft
                this.setState({ showModifyModal: false, remarkId: null, remarkDraft: '', remarks: remarks })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    handleRemoveRemark(id, e) {
        e.stopPropagation()
        this.props.dispatch(requestContents(''))
        api.deleteTimeLineRemark(
            id,
            () => {
                var remarks = this.state.remarks.slice()
                var index = remarks.findIndex(remark => remark.id == id)
                if (index > -1) {
                    remarks.splice(index, 1)
                }
                this.setState({ remarks: remarks })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    handleModifyTransactionStatus() {
        this.setState({ showPickerView: true, transactionStatus: this.state.timeLine.transactionStatusId })
    }

    handleTransactionStatusChange(value) {
        this.setState({ transactionStatus: value })
    }

    handleModifyTransactionStatusCancel() {
        this.setState({ showPickerView: false, transactionStatus: null })
    }

    handleModifyTransactionStatusConfirm() {
        var timeLine = Object.assign({}, this.state.timeLine, {
            'transactionStatusId': this.state.transactionStatus
        })
        this.setState({ showPickerView: false, transactionStatus: null, timeLine: timeLine })
    }

    handleAlertCycleChange(event) {
        var alertCycle = event.target.value
        var timeLine = Object.assign({}, this.state.timeLine, {
            'alertCycle': alertCycle
        })
        this.setState({
            'timeLine': timeLine
        })
    }

    handleChangeTimeLine() {
        var param = {
            timeLineId: this.state.timeLineId,
            transactionStatus: this.state.timeLine.transactionStatusId,
            alertCycle: this.state.timeLine.alertCycle
        }
        this.props.dispatch(requestContents(''))
        api.changeTimeLine(
            param,
            () => {
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    componentDidMount() {
        var timeLineId = parseInt(this.props.match.params.id)
        this.setState({ timeLineId: timeLineId })
        this.props.dispatch(requestContents(''))
        api.getTimeLine(
            timeLineId,
            timeLine => {
                this.setState({ 'timeLine': timeLine })
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
        api.getTimeLineRemarks(
            timeLineId,
            remarks => {
                this.setState({ 'remarks': remarks})
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    render() {
        var stages = [
            {name: '获取项目概要', value: 0},
            {name: '签署保密协议', value: 1},
            {name: '获取投资备忘录', value: 2},
            {name: '进入一期资料库', value: 3},
            {name: '签署投资意向书/投资条款协议', value: 4},
            {name: '进入二期资料库', value: 5},
            {name: '进场尽职调查', value: 6},
            {name: '签署约束性报价书', value: 7},
            {name: '起草法律协议', value: 8},
            {name: '签署法律协议', value: 9},
            {name: '完成交割', value: 10},
        ]

        var timeLine = this.state.timeLine
        var stage = stages.filter(stage => stage.value == timeLine.transactionStatusId)[0]
        var transactionStatusName = stage && stage.name

        return (
            <div style={containerStyle}>
                <NavigationBar title="编辑进程" backIconClicked={this.props.history.goBack} action="提交" onActionButtonClicked={this.handleChangeTimeLine} />
                <div style={wrapStyle}>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>当前状态</div>
                        <div style={colRightStyle} onClick={this.handleModifyTransactionStatus}>
                            { transactionStatusName }
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>提醒周期/天</div>
                        <div style={colRightStyle}>
                            <input type="text" style={inputStyle} value={timeLine.alertCycle} onChange={this.handleAlertCycleChange} />
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>时间轴备注</div>
                        <div style={colRightStyle}>
                            <div style={{textAlign: 'right'}}>
                                <a href="javascript:void(0)" style={openModalStyle} onClick={this.handleAddRemark}>添加备注</a>                                    
                            </div>
                        </div>
                    </div>
                </div>

                <div style={remarksStyle}>
                    {
                        this.state.remarks.map(remark => {
                            return (
                                <div style={remarkWrapStyle} key={remark.id} onClick={this.handleModifyRemark.bind(this, remark)}>
                                    <SwipeCell delete={this.handleRemoveRemark.bind(this, remark.id)}>
                                        <div style={remarkStyle}>
                                            <p style={contentStyle}>{remark.remark}</p>
                                            <p style={timeStyle}>{remark.creationTime.split('T')[0]}</p>
                                        </div>
                                    </SwipeCell>
                                </div>
                            )
                        })
                    }
                </div>

                <NoteModal show={this.state.showAddModal}
                           value={this.state.remarkDraft}
                           onValueChange={this.handleRemarkValueChange}
                           onCancel={this.handleAddRemarkCancel}
                           onConfirm={this.handleAddRemarkConfirm}>
                </NoteModal>

                <NoteModal show={this.state.showModifyModal}
                           value={this.state.remarkDraft}
                           onValueChange={this.handleRemarkValueChange}
                           onCancel={this.handleModifyRemarkCancel}
                           onConfirm={this.handleModifyRemarkConfirm}>
                </NoteModal>

                <div style={pickerViewWrapStyle}>
                    <PickerView show={this.state.showPickerView}
                                title="项目进度"
                                options={stages}
                                value={this.state.transactionStatus}
                                onValueChange={this.handleTransactionStatusChange}
                                onCancel={this.handleModifyTransactionStatusCancel}
                                onConfirm={this.handleModifyTransactionStatusConfirm}>
                    </PickerView>
                </div>

            </div>
        )
    }
}


export default connect()(EditTimeline)
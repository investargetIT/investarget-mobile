import React from 'react'
import NoteModal from '../components/NoteModal'
import SwipeCell from '../components/SwipeCell'
import PickerView from '../components/PickerView'

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

var notesStyle = {
    width: '100%',
}
var noteWrapStyle = {
    marginBottom: '2px',
}
var noteStyle = {
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


class EditTimeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            showPickerView: false,
            notes: [
                {id: 0, content: '下午开产品会', time: '2017-04-06 16:00'},
                {id: 1, content: '下午开产品会', time: '2017-04-06 16:00'},
                {id: 2, content: '下午开产品会', time: '2017-04-06 16:00'},
            ],
            stages: [
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
            ],
            currStage: 0,
        }

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.addNote = this.addNote.bind(this)
        
        this.openPicker = this.openPicker.bind(this)
        this.closePicker = this.closePicker.bind(this)
        this.pickStage = this.pickStage.bind(this)
    }

    openModal(event) {
        this.setState({
            showModal: true,
        })
    }

    closeModal() {
        this.setState({
            showModal: false,
        })
    }

    addNote(content) {
        var notes = this.state.notes.slice()
        notes.push({
            id: notes.length,
            content: content,
            time: '2017-04-08 14:00',
        })
        this.setState({
            showModal: false,
            notes: notes
        })
    }

    removeNote(id) {
        var notes = this.state.notes.slice()
        var index = notes.findIndex(note => note.id == id)
        if (index > -1) {
            notes.splice(index, 1)
            this.setState({
                notes: notes
            })
        }
    }

    openPicker() {
        this.setState({
            showPickerView: true
        })
    }

    closePicker() {
        this.setState({
            showPickerView: false
        })
    }

    pickStage(val) {
        this.setState({
            currStage: val,
            showPickerView: false
        })
    }

    render() {
        return (
            <div style={containerStyle}>
                <div style={wrapStyle}>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>当前状态</div>
                        <div style={colRightStyle} onClick={this.openPicker}>
                            { this.state.stages.filter(stage => stage.value == this.state.currStage)[0].name }
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>提醒周期/天</div>
                        <div style={colRightStyle}>7</div>
                    </div>
                    <div style={rowStyle}>
                        <div style={colLeftStyle}>时间轴备注</div>
                        <div style={colRightStyle}>
                            <div style={{textAlign: 'right'}}>
                                <a href="javascript:void(0)" style={openModalStyle} onClick={this.openModal}>添加备注</a>                                    
                            </div>
                        </div>
                    </div>
                </div>

                <div style={notesStyle}>
                    {
                        this.state.notes.map(note => {
                            return (
                                <div style={noteWrapStyle} key={note.id}>
                                    <SwipeCell delete={this.removeNote.bind(this, note.id)}>
                                        <div style={noteStyle}>
                                            <p style={contentStyle}>{note.content}</p>
                                            <p style={timeStyle}>{note.time}</p>
                                        </div>
                                    </SwipeCell>
                                </div>
                            )
                        })
                    }
                </div>

                <NoteModal show={this.state.showModal} onClose={this.closeModal} onSave={this.addNote}></NoteModal>

                <div style={pickerViewWrapStyle}>
                    <PickerView show={this.state.showPickerView} title="项目进度" options={this.state.stages} value={this.state.currStage} onConfirm={this.pickStage} onCancel={this.closePicker}></PickerView>
                </div>

            </div>
        )
    }
}


export default EditTimeline
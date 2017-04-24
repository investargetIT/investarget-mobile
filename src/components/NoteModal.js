import React from 'react'
import api from '../api'


var coverStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    backgroundColor: 'rgba(0,0,0,.3)',
}
var hiddenStyle = Object.assign({}, coverStyle, {
    display: 'none',
})

var wrapStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '120px',
    minHeight: '100%',
}

var modalStyle = {
    width: '90%',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    boxShadow: '0 0 2px 1px rgba(158,158,158,.17)',
}
var headStyle = {
    marginBottom: '10px',
    borderBottom: '1px solid #f4f4f4',
    position: 'relative',
}
var titleStyle = {
    fontSize: '16px',
    paddingBottom: '8px',
    color: '#0f256e',
}
var closeStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '16px',
    height: '16px',
    textAlign: 'center',
}
var bodyStyle = {
    marginBottom: '10px',
}
var textareaStyle = {
    width: '100%',
    height: '6.5em',
    lineHeight: '1.3em',
    outline: 'none',
    border: 'none',
    resize: 'none',
}
var footStyle = {
    textAlign: 'center',
}
var saveStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    border: 'none',
    fontSize: '16px',
    lineHeight: '1',
    borderRadius: '2px',
    color: '#fff',
    backgroundColor: '#153c91',
    outline: 'none',
}


const Modal = function(props) {
    return (
        <div style={props.show ? coverStyle : hiddenStyle}>
            <div style={wrapStyle}>
                <div style={modalStyle}>
                    <div style={headStyle}>
                        <div style={titleStyle}>备注信息</div>
                        <img style={closeStyle} src={api.baseUrl + "images/closeView@2x.png"} onClick={props.onCancel}></img>
                    </div>
                    <div style={bodyStyle}>
                        <textarea style={textareaStyle} placeholder="新备注" value={props.value} onChange={props.onValueChange}></textarea>
                    </div>
                    <div style={footStyle}>
                        <button style={saveStyle} onClick={props.onConfirm}>保存</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
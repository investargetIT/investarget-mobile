import React from 'react'


const maskStyle = {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    height: '100%',
    zIndex: '999',
    backgroundColor: 'rgba(0,0,0,.4)',
}
const wrapStyle = {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    height: '100%',
    zIndex: '999',
    WebkitOverflowScrolling: 'touch',
    outline: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}
const modalStyle = {
    width: '80%',
    height: 'auto',
}
const contentStyle = {
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '4px',
    paddingTop: '10px',
}
const headerStyle = {
    fontSize: '18px',
    marginBottom: '10px',
}
const bodyStyle = {
    padding: '0 8px 8px 8px',
    borderBottom: '1px solid #ddd',
}
const footerStyle = {
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}
const actionStyle = {
    height: '100%',
    flexShrink: '0',
    flexGrow: '1',
    fontSize: '16px',
    color: '#10458f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}
const actionBorderStyle = Object.assign({}, actionStyle, {
    borderRight: '1px solid #ddd',
})


const Modal = (props) => {
    return (
        <div style={props.show ? {} : {display: 'none'}}>
            <div style={maskStyle}></div>
            <div style={wrapStyle}>
                <div style={modalStyle}>
                    <div style={contentStyle}>
                        <div style={headerStyle}>
                            {props.title}
                        </div>
                        <div style={bodyStyle}>
                            {props.content}
                        </div>
                        {props.actions ? 
                        <div style={footerStyle}>
                                {
                                    props.actions.map((action, index) => (
                                        <div key={index} style={index < props.actions.length - 1 ? actionBorderStyle : actionStyle} onClick={action.handler}>{action.name}</div>
                                    ))
                                }
                        </div>
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
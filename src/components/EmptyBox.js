import React from 'react'
import api from '../api'

const containerStyle = {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: '50px',
}
const imageStyle = {
    width: '100px',
    marginBottom: '10px',
}
const textStyle = {
    fontSize: '13px',
    color: '#999',
}

const EmptyBox = (props) => {
    return (
        <div style={containerStyle}>
            <img style={imageStyle} src={api.baseUrl + "images/emptyBox@2x.png"} />
            <p style={textStyle}>没有任何项目</p>
        </div>
    )
}

export default EmptyBox
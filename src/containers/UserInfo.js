import React from 'react'


var containerStyle = {}
var backgroundStyle  = {
    height: '180px',
    backgroundImage: 'url(images/userInfoBG@2x.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
}
var headStyle = {
    paddingTop: '33px',
    textAlign: 'center',
}
var imageStyle = {
    width: '72px',
    height: '72px',
    verticalAlign: 'top',
}
var nameWrapStyle = {
    marginTop: '15px',
    height: '60px',
    backgroundColor: 'rgba(0,0,0,.3)',
    textAlign: 'center',
    paddingTop: '10px',
}
var nameStyle = {
    color: '#fff',
    fontSize: '16px',
}
var infoStyle = {

}
var titleStyle = {
    fontSize: '14px',
    fontWeight: '400',
    color: '#999',
    lineHeight: '2',
    padding: '10px 17px',
}
var detailStyle = {

}
var rowStyle = {
    padding: '10px 17px',
    borderBottom: '1px solid #f4f4f4',
}


class UserInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={containerStyle}>
                <div style={backgroundStyle}>
                    <div style={headStyle}>
                        <img style={imageStyle} src="/images/userCenter/defaultAvatar@2x.png"></img>
                    </div>
                    <div style={nameWrapStyle}>
                        <span style={nameStyle}>junke</span>
                    </div>
                </div>
                <div style={infoStyle}>
                    <h3 style={titleStyle}>个人信息</h3>
                    <div style={detailStyle}>
                        <div style={rowStyle}>公司：海拓</div>
                        <div style={rowStyle}>职位：首席运营官</div>
                        <div style={rowStyle}>手机号码：<a href="tel:18637760716">18637760716</a></div>
                        <div style={rowStyle}>电子邮箱：<a href="mailto:wjk1397@126.com">wjk1397@126.com</a></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserInfo
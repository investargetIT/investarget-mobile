import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { requestContents, hideLoading, handleError } from '../actions'
import { connect } from 'react-redux'

var containerStyle = {}
var backgroundStyle  = {
    height: '180px',
    backgroundImage: 'url(' + api.baseUrl + '/images/userInfoBG@2x.png)',
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

        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        var userId = this.props.match.params.id
        this.props.dispatch(requestContents(''))
        api.getUserBasic(userId, 
            user => {
                this.setState({'user': user})
                this.props.dispatch(hideLoading())
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    render() {
        var user = this.state.user;
        return (
            <div style={containerStyle}>
                <NavigationBar title="个人信息" backIconClicked={this.props.history.goBack} />
                <div style={backgroundStyle}>
                    <div style={headStyle}>
                        <img style={imageStyle} src={user.photoUrl || api.baseUrl + '/images/userCenter/defaultAvatar@2x.png'}></img>
                    </div>
                    <div style={nameWrapStyle}>
                        <span style={nameStyle}>{user.name}</span>
                    </div>
                </div>
                <div style={infoStyle}>
                    <h3 style={titleStyle}>个人信息</h3>
                    <div style={detailStyle}>
                        <div style={rowStyle}>公司：{user.company}</div>
                        <div style={rowStyle}>职位：{user.title && user.title.titleName}</div>
                        <div style={rowStyle}>手机号码：<a href="tel:18637760716">{user.mobile}</a></div>
                        <div style={rowStyle}>电子邮箱：<a href="mailto:wjk1397@126.com">{user.emailAddress}</a></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(UserInfo)
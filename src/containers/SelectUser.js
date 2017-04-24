import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading, setRecommendInvestors, clearRecommend } from '../actions'
import { connect } from 'react-redux'
import Modal from '../components/Modal'


const containerStyle = {
    height: '100%',
}
const contentStyle = {
    minHeight: '100%',
    backgroundColor: '#eef5f6',
}
const userWrapStyle = {
    marginBottom: '8px',
}
const userStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '20px 10px 10px 10px',
    backgroundColor: '#fff',
}
const userActiveStyle = Object.assign({}, userStyle, {
    backgroundColor: '#d9d9d9',
})
const userPhotoWrapStyle = {
    flexShrink: '0',
    width: '80px',
    textAlign: 'center',
}
const userPhotoStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    verticalAlign: 'top',
}
const userContentStyle = {
    flexGrow: '1',
    height: '100%',
}
const userOrgStyle = {
    marginBottom: '10px',
    fontSize: '15px',
}
const userPersonStyle = {
    fontSize: '15px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
}
const userNameStyle = {
    flexShrink: '0',
    marginRight: '1em',
    width: '5em',
}
const userTitleStyle = {
    flexGrow: '1',
    fontSize: '13px',
    color: '#999',
}


function arrayRemove(array, item) {
  var _array = array.slice()
  var index = _array.findIndex(i => i == item)
  _array.splice(index, 1)
  return _array
}

function arrayAdd(array, item) {
  var _array = array.slice()
  _array.push(item)
  return _array
}

class SelectUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myUsers: [],
            showModal: false,
        }
        this.confirmSelect = this.confirmSelect.bind(this)
        this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
        this.handleRecommendSuccess = this.handleRecommendSuccess.bind(this)
    }


    toggleSelect(id) {
        var _ids = this.props.selectedUsers.includes(id) ?
                        arrayRemove(this.props.selectedUsers, id) :
                        arrayAdd(this.props.selectedUsers, id)

        this.props.dispatch(setRecommendInvestors(_ids))
    }

    confirmSelect() {
        if (this.props.selectedUsers.length > 0 && this.props.selectedProjects.length > 0) {
            this.recommend()
        }
    }

    handleBackIconClicked() {
        this.props.dispatch(setRecommendInvestors([]))
        this.props.history.goBack()
    }

    recommend() {
        var all = []
        this.props.dispatch(requestContents(''))

        this.props.selectedUsers.forEach(userId => {
            this.props.selectedProjects.forEach(projectId => {
                all.push(new Promise((resolve, reject) => {
                    var param = {}
                    if (this.props.userType == 3) { // 交易师
                        param = {
                            userId: userId,
                            projectId: projectId,
                            fType: 1,
                            transactionId: this.props.userId
                        }
                    } else if (this.props.userType == 1) { // 投资人
                        param = {
                            userId: this.props.userId,
                            projectId: projectId,
                            fType: 4,
                            transactionId: userId
                        }
                    }

                    api.favoriteProject(
                        param,
                        () => resolve(),
                        error => reject(error)
                    )
                }))
            })
        })

        Promise.all(all)
        .then(
            items => {
                this.props.dispatch(hideLoading())
                this.props.dispatch(clearRecommend())
                this.setState({
                    showModal: true
                })
            }
        )
        .catch(
            error => {
                this.props.dispatch(handleError(error))
                this.props.dispatch(clearRecommend())
            }
        )
    }

    handleRecommendSuccess() {
        this.setState({ showModal: false })
        this.props.history.goBack()
    }


    componentDidMount() {
        this.props.dispatch(requestContents(''))
    
        api.getUsers(
            data => {
                this.props.dispatch(hideLoading())

                const myUsers = data.items.map(item => {
                    var object = {}
                    object.id = item.id
                    object.name = item.name
                    object.org = (item.org && item.org.name) || item.company
                    object.photoUrl = item.photoUrl
                    object.title = item.title.titleName
                    return object
                })
                this.setState({myUsers: myUsers})
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    render() {
        return (
            <div style={containerStyle}>

                <NavigationBar title={this.props.userType === 3 ? '选择投资人' : '选择交易师' }
                               backIconClicked={this.handleBackIconClicked}
                               action={this.props.selectedUsers.length ? '确定' : null }
                               onActionButtonClicked={this.confirmSelect} />  

                <div style={contentStyle}>
                    {
                        this.state.myUsers.map(user => 
                            (
                                <div style={userWrapStyle} key={user.id}>
                                    <div style={ this.props.selectedUsers.includes(user.id) ? userActiveStyle : userStyle }
                                         onClick={this.toggleSelect.bind(this, user.id)}>
                                        <div style={userPhotoWrapStyle}>
                                            <img style={userPhotoStyle} src={user.photoUrl || api.baseUrl + '/images/userCenter/defaultAvatar@2x.png'} alt="photo"/>
                                        </div>
                                        <div style={userContentStyle}>
                                            <div style={userOrgStyle}>{user.org}</div>
                                            <div style={userPersonStyle}>
                                                <span style={userNameStyle}>{user.name}</span>
                                                <span style={userTitleStyle}>{user.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>

                <Modal show={this.state.showModal}
                       title="通知"
                       content={this.props.userType === 3 ? '推荐成功' : '感兴趣成功'}
                       actions={[{name: '确定', handler: this.handleRecommendSuccess}]} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { recommendProcess, userInfo } = state
    const selectedUsers = recommendProcess.investorIds
    const selectedProjects = recommendProcess.projectIds
    const userId = userInfo.id
    const userType = userInfo.userType

    return { selectedUsers, selectedProjects, userId, userType }
}

export default connect(mapStateToProps)(SelectUser)
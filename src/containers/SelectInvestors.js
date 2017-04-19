import React from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading, setRecommendInvestors, clearRecommend } from '../actions'
import { connect } from 'react-redux'


const containerStyle = {
    height: '100%',
}
const contentStyle = {
    minHeight: '100%',
    backgroundColor: '#eef5f6',
}
const investorWrapStyle = {
    marginBottom: '8px',
}
const investorStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '20px 10px 10px 10px',
    backgroundColor: '#fff',
}
const investorActiveStyle = Object.assign({}, investorStyle, {
    backgroundColor: '#d9d9d9',
})
const investorPhotoWrapStyle = {
    flexShrink: '0',
    width: '80px',
    textAlign: 'center',
}
const investorPhotoStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    verticalAlign: 'top',
}
const investorContentStyle = {
    flexGrow: '1',
    height: '100%',
}
const investorOrgStyle = {
    marginBottom: '10px',
    fontSize: '15px',
}
const investorPersonStyle = {
    fontSize: '15px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
}
const investorNameStyle = {
    flexShrink: '0',
    marginRight: '1em',
    width: '5em',
}
const investorTitleStyle = {
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

class SelectInvestors extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myInvestor: []
        }
        this.confirmSelect = this.confirmSelect.bind(this)
        this.handleBackIconClicked = this.handleBackIconClicked.bind(this)
    }

    confirmSelect() {
        var investorIds = this.props.recommendProcess.investorIds
        var projectIds  = this.props.recommendProcess.projectIds
        if (investorIds.length > 0 && projectIds.length > 0) {
            this.recommend()
        }
    }

    recommend() {
        alert('recommend')
        // var userId = api.getCurrentUserId()
        // var investorIds = this.props.recommendProcess.investorIds
        // var projectIds  = this.props.recommendProcess.projectIds
        // var all = []

        // this.props.dispatch(requestContents(''))
        // investorIds.forEach(investorId => {
        //     projectIds.forEach(projectId => {
        //         all.push(new Promise((resolve, reject) => {
        //             var param = {
        //                 userId: investorId,
        //                 projectId: projectId,
        //                 fType: 1,
        //                 transactionId: userId,
        //             }
        //             api.favoriteProject(
        //                 param,
        //                 () => resolve(),
        //                 error => reject(error)
        //             )
        //         }))
        //     })
        // })

        // Promise.all(all)
        // .then(
        //     items => {
        //         this.props.dispatch(hideLoading())
        //         this.props.dispatch(clearRecommend())
        //     }
        // )
        // .catch(
        //     error => {
        //         this.props.dispatch(handleError(error))
        //         this.props.dispatch(clearRecommend())
        //     }
        // )
    }

    toggleSelect(id) {
        var investorIds = this.props.recommendProcess.investorIds
        var _ids = investorIds.includes(id) ?
                            arrayRemove(investorIds, id) :
                            arrayAdd(investorIds, id)

        this.props.dispatch(setRecommendInvestors(_ids))
    }

    handleBackIconClicked() {
        this.props.dispatch(setRecommendInvestors([]))
        this.props.history.goBack()
    }

    componentDidMount() {
        this.props.dispatch(requestContents(''))
    
        api.getUsers(
            data => {
                this.props.dispatch(hideLoading())

                const myInvestor = data.items.map(item => {
                    var object = {}
                    object.id = item.id
                    object.name = item.name
                    object.org = (item.org && item.org.name) || item.company
                    object.photoUrl = item.photoUrl
                    object.title = item.title.titleName
                    return object
                })
                this.setState({myInvestor: myInvestor})
            },
            error => this.props.dispatch(handleError(error))
        )
    }

    render() {
        var investorIds = this.props.recommendProcess.investorIds
        return (
            <div style={containerStyle}>
                {
                    investorIds.length > 0 ? 
                        <NavigationBar title="选择投资人" backIconClicked={this.handleBackIconClicked} action="确定" onActionButtonClicked={this.confirmSelect} />
                        :
                        <NavigationBar title="选择投资人" backIconClicked={this.handleBackIconClicked}/>   
                }
                <div style={contentStyle}>
                    {
                        this.state.myInvestor.map(investor => (
                            <div style={investorWrapStyle} key={investor.id}>
                                <div style={ investorIds.includes(investor.id) ? investorActiveStyle : investorStyle } onClick={this.toggleSelect.bind(this, investor.id)}>
                                    <div style={investorPhotoWrapStyle}>
                                        <img style={investorPhotoStyle} src={investor.photoUrl} alt="photo"/>
                                    </div>
                                    <div style={investorContentStyle}>
                                        <div style={investorOrgStyle}>{investor.org}</div>
                                        <div style={investorPersonStyle}>
                                            <span style={investorNameStyle}>{investor.name}</span>
                                            <span style={investorTitleStyle}>{investor.title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        recommendProcess: state.recommendProcess
    }
}
export default connect(mapStateToProps)(SelectInvestors)
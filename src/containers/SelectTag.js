import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import SelectWithSearch from '../components/SelectWithSearch'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { modifyUserInfo, handleError, requestContents, hideLoading } from '../actions'

const searchContainerStyle = {
  flex: 1,
  marginRight: 10,
  height: '30px',
  backgroundColor: 'lightgrey',
  lineHeight: 'normal',
  borderRadius: '10px'
}
const searchInputStyle = {
  fontSize: '16px',
  backgroundColor: 'lightgrey',
  border: 'none',
  height: '100%',
  width: '80%',
  verticalAlign: 'middle'
}
const searchIconStyle = {
  width: '20px',
  height: '20px',
  marginLeft: 8,
  marginRight: '8px',
  verticalAlign: 'middle',
}

class Search extends Component {
  constructor(props) {
    super(props);
  }

  onChange = event => {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div style={{ backgroundColor: 'white', position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', padding: 10 }}>
        <div style={searchContainerStyle}>
          <img style={searchIconStyle} src={api.baseUrl + "/images/home/ic_search.svg"} />
          <input style={searchInputStyle} type="text" placeholder="搜索标签" onChange={this.onChange} />
        </div>
        <button style={{ padding: '0 10px' }}>提交</button>
      </div>
    );
  }
}

class MyTag extends Component {

  constructor(props) {
    super(props)

    this.handleSelectTags = this.handleSelectTags.bind(this)
  }

  handleSelectTags(items) {

    const param = Object.assign({}, this.props.userInfo, {
      userTagses: items,
      orgId: this.props.userInfo.org ? this.props.userInfo.org.id : null,
      orgAreaId: this.props.userInfo.orgArea ? this.props.userInfo.orgArea.id : null,
      titleId: this.props.userInfo.title ? this.props.userInfo.title.id : null,
    })

    const newUserInfo = Object.assign({}, this.props.userInfo, {
      userTags: items.map(item => {
        var obj = {}
        obj.id = item
        return obj
      })
    })

    this.props.dispatch(requestContents(''))


    const userId = utils.getCurrentUserId()

    newApi.editUser([userId], { tags: items })
      .then(data => {
        this.props.dispatch(hideLoading())
        console.log(this.props.tags, items)
        const userTags = this.props.tags.filter(item => items.includes(item.id))
        const newUserInfo = { ...this.props.userInfo, userTags }
        this.props.dispatch(modifyUserInfo(newUserInfo))
        this.props.dispatch(handleError(new Error('update success')))
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })

  }

  handleSearchChange = content => {
    console.log('content', content);
  }

  render() {
    return (
      <div>
        <Search onChange={this.handleSearchChange} />
        <div style={{ marginTop: 50 }}>
          <SelectWithSearch
            multiple={true}
            options={this.props.tags.map(item =>
              Object.assign({}, item, {
                name: item.tagName
              })
            )}
            selected={this.props.selectedTag.map(item => item.id)}
            onConfirm={this.handleSelectTags} />
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo, selectedTag } = state
  return { tags, userInfo, selectedTag };
}

export default connect(mapStateToProps)(MyTag)
import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import SelectWithSearch from '../components/SelectWithSearch'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { modifyUserInfo, handleError, requestContents, hideLoading } from '../actions'

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

  render() {
    return (
      <div>
        <NavigationBar title="选择标签" hideBack />
        <SelectWithSearch
          // title="为投资人设置标签"
          multiple={true}
          options={this.props.tags.map(item =>
            Object.assign({}, item, {
              name: item.tagName
            })
          )}
          selected={this.props.selectedTag.map(item => item.id)}
          onConfirm={this.handleSelectTags} />
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo, selectedTag } = state
  return { tags, userInfo, selectedTag };
}

export default connect(mapStateToProps)(MyTag)
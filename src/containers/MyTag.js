import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import Select from '../components/Select'
import { connect } from 'react-redux'
import api from '../api'
import { modifyUserInfo, handleError } from '../actions'

class MyTag extends Component {

  constructor(props) {
    super(props)

    this.handleSelectTags = this.handleSelectTags.bind(this)
  }

  handleSelectTags(items) {

    const param = Object.assign({}, this.props.userInfo, {
      userTagses: items,
      orgId: this.props.userInfo.org.id,
      orgAreaId: this.props.userInfo.orgArea.id,
      titleId: this.props.userInfo.title.id,
    })

    const newUserInfo = Object.assign({}, this.props.userInfo, {
      userTags: items.map(item => {
        var obj = {}
        obj.id = item
        return obj
      })
    })

    api.modifyUser(
      param,
      () => {
        this.props.dispatch(modifyUserInfo(newUserInfo))
        this.props.dispatch(handleError(new Error('update success')))
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  render() {
    return (
      <div>
        <NavigationBar title="关注标签" backIconClicked={this.props.history.goBack} />
        <Select
          title="请选择您关注的标签"
          multiple={true}
          options={this.props.tags.map(item =>
            Object.assign({}, item, {
              name: item.tagName
            })
          )}
          selected={this.props.userInfo.userTags.map(item => item.id)}
          onConfirm={this.handleSelectTags} />
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo } = state
  return { tags, userInfo }
}

export default connect(mapStateToProps)(MyTag)
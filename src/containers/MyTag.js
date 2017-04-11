import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import Select from '../components/Select'
import { connect } from 'react-redux'

class MyTag extends Component {

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
          onConfirm={this.handleSelectTags} />
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags } = state
  return { tags }
}

export default connect(mapStateToProps)(MyTag)
import React, { Component } from 'react'
import TabBar from './TabBar'
import PostListCell from '../components/PostListCell'
import { connect } from 'react-redux'

class Activities extends Component {

  render() {

    var rows = []
    this.props.activities.forEach(function (element) {
      rows.push(
        <PostListCell
          title={element.title}
          imgUrl={element.url}
          detailUrl={element.detailUrl}
          key={element.title} />
      )
    }, this)

    return (
      <div>
        {rows}
        <TabBar />
      </div>
    )

  }
  
}

function mapStateToProps(state) {
  const { activities }= state;
  return { activities }
}

export default connect(mapStateToProps)(Activities)

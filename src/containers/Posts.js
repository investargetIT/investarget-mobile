import React, { Component } from 'react'
import TabBar from './TabBar'
import PostListCell from '../components/PostListCell'
import { connect } from 'react-redux'

class Posts extends Component {

  render() {

    var rows = []
    this.props.posts.forEach(function (element) {
      rows.push(
        <PostListCell
          title={element.title}
          imgUrl={element.imgUrl}
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
  const posts = state.posts
  return {posts}
}

export default connect(mapStateToProps)(Posts)

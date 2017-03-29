import React, { Component } from 'react'
import TabBar from './TabBar'
import PostListCell from './PostListCell'
import axios from 'axios'
import { receivePosts } from '../actions'
import { connect } from 'react-redux'

class Posts extends Component {

  componentDidMount() {
    axios.get('https://api.investarget.com/api/services/InvestargetApi/activityPicture/GetActivitypictures')
    .then(response => {
      if (response.data.success) {
        console.log(response.data)
        var result = response.data.result.map(item => {
          var obj = {}
          obj['title'] = item.title
          obj['imgUrl'] = item.url
          obj['detailUrl'] = item.detailUrl
          return obj
        })
        this.props.dispatch(receivePosts(result))
      } else {
        throw response.data.error
      }
    })
    .catch(error => console.error(error))
  }

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

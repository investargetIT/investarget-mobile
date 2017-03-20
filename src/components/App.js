import React, { Component } from 'react'
import ProjectListCell from './ProjectListCell'
import { connect } from 'react-redux'
import { fetchContents } from '../actions'

class App extends Component {

  componentDidMount() {
    this.props.dispatch(fetchContents(''))
  }

  render() {
    var rows = []
    this.props.projects.forEach(function(element) {
      rows.push(
        <ProjectListCell
          title={element.title}
          country={element.country}
          industrys={element.industrys.join('')}
          imgUrl={element.imgUrl}
          amount={element.amount}
          key={element.imgUrl} />
      )
    }, this)
    return (
      <div>{rows}</div>
    )
  }
}

function mapStateToProps(state) {
  const projects = state.contents.response
  return {projects}
}

export default connect(mapStateToProps)(App);

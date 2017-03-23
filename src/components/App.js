import React, { Component } from 'react'
import ProjectListCell from './ProjectListCell'
import { connect } from 'react-redux'
import { fetchContents } from '../actions'
import TabBar from './TabBar'

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
          key={element.title} />
      )
    }, this)
    return (
      <div>
        <div>{rows}</div>
        <TabBar />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const projects = state.projects
  return {projects}
}

export default connect(mapStateToProps)(App);

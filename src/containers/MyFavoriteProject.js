import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import ProjectListCell from '../components/ProjectListCell'
import { Link } from 'react-router-dom'

const contentContainerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px'
}

class MyFavoriteProject extends Component {

  constructor(props) {
    super(props)

    this.state = { projects: [] }
  }

  componentDidMount() {
    this.props.dispatch(requestContents(''))
    api.getFavoriteProjects(
      favoriteProjects => {
        this.props.dispatch(hideLoading())
        this.setState({ projects: favoriteProjects })
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  render() {

    const content = this.state.projects.map(element =>
      <Link to={"/project/" + element.id} key={element.id}>
        <ProjectListCell
          title={element.titleC}
          country={element.country.countryName}
          industrys={element.industrys.map(item => item.industryName).join('')}
          imgUrl={element.industrys[0].imgUrl}
          amount={element.financedAmount}
          id={element.id} />
      </Link>
    )

    return (
      <div>
        <NavigationBar title="我收藏的项目" backIconClicked={this.props.history.goBack} />
        <div style={contentContainerStyle}>
          {content}
        </div>
      </div>
    )
    
  }

}

export default connect()(MyFavoriteProject)
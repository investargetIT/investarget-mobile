import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import api from '../api'
import { handleError, requestContents, hideLoading } from '../actions'
import { connect } from 'react-redux'
import ProjectListCell from '../components/ProjectListCell'
import { Link } from 'react-router-dom'
import SwipeCell from '../components/SwipeCell'

const contentContainerStyle = {
  backgroundColor: '#EEF3F4',
  minHeight: window.innerHeight - 48 + 'px',
  paddingTop: '2px'
}

const emptyPicStyle = {
  display: 'block',
  width: '30%',
  margin: '30px auto'
}

class MyFavoriteProject extends Component {

  constructor(props) {
    super(props)

    this.state = { projects: [] }
  }

  componentDidMount() {
    this.props.dispatch(requestContents(''))
    api.getFavoriteProjects(
      {
        'input.userId': api.getCurrentUserId(),
        'input.ftypes': '3',
        'input.maxResultCount': 10,
        'input.skipCount': 0,
      },
      favoriteProjects => {
        this.props.dispatch(hideLoading())
        this.setState({ projects: favoriteProjects })
      },
      error => this.props.dispatch(handleError(error))
    )
  }

  removeFavoriteProject(id) {
    this.setState({
      projects: this.state.projects.filter(item => item.id !== id)
    })
    api.projectCancelFavorite(id)
  }

  render() {
    console.log(this.state.projects)

    const content = this.state.projects.map(project =>
      <div className="margin-bottom-2" key={project.id}>
        <SwipeCell delete={this.removeFavoriteProject.bind(this, project.id)} action="取消收藏" actionBackgroundColor="#276CD2" >
          <Link to={"/project/" + project.id} >
            <ProjectListCell
              title={project.title}
              country={project.country}
              industrys={project.industrys.join('')}
              imgUrl={project.imgUrl}
              amount={project.amount}
              id={project.id} />
          </Link>
        </SwipeCell>
      </div>
    )

    return (
      <div>
        <NavigationBar title="我收藏的项目" backIconClicked={this.props.history.goBack} />
        <div style={contentContainerStyle}>
          {this.state.projects.length > 0 ? content : <img style={emptyPicStyle} src="/images/emptyBox@2x.png" />}
        </div>
      </div>
    )
    
  }

}

export default connect()(MyFavoriteProject)
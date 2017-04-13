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

    const content = this.state.projects.map(element =>
      <div className="margin-bottom-2" key={element.id}>
        <SwipeCell delete={this.removeFavoriteProject.bind(this, element.id)} action="取消收藏" actionBackgroundColor="#276CD2" >
          <Link to={"/project/" + element.id} >
            <ProjectListCell
              title={element.titleC}
              country={element.country.countryName}
              industrys={element.industrys.map(item => item.industryName).join('')}
              imgUrl={element.industrys[0].imgUrl}
              amount={element.financedAmount}
              id={element.id} />
          </Link>
        </SwipeCell>
      </div>
    )

    return (
      <div>
        <NavigationBar title="我收藏的项目" backIconClicked={this.props.history.goBack} />
        <div style={contentContainerStyle}>
          {content.length > 0 ? content : <img style={emptyPicStyle} src="/images/emptyBox@2x.png" />}
        </div>
      </div>
    )
    
  }

}

export default connect()(MyFavoriteProject)
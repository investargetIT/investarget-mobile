import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './containers/App'
import Posts from './containers/Posts'
import Events from './containers/Events'
import User from './containers/User'
import LoadingAndToast from './containers/LoadingAndToast'
import HandleError from './containers/HandleError'
import Login from './containers/Login'
import Register from './containers/Register'
import Register2 from './containers/Register2'
import ProjectDetail from  './containers/ProjectDetail'
import { connect } from 'react-redux'
import { readUserInfoFromLocalStorage, handleError } from './actions'
import MasterDetail from './components/MasterDetail'
import { receivePosts } from './actions'
import api from './api'
import TimelineManagement from './components/TimelineManagement'

const Routes = (props) => {

  api.getPostsAndEvent(
    posts => props.dispatch(receivePosts(posts)),
    error => props.dispatch(handleError(error))
  )
  props.dispatch(readUserInfoFromLocalStorage())

  return (
    <Router>
      <div id="container">

        <LoadingAndToast />
        <HandleError />

        <Route exact path="/" component={App} />
        <Route path="/posts" component={Posts} />
        <Route path="/events" component={Events} />
        <Route path="/user" component={User} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/register2" component={Register2} />
        <Route path="/filter" component={MasterDetail} />
        <Route path="/project" component={ProjectDetail} />
        <Route path="/timeline_management" component={TimelineManagement} />

      </div>
    </Router>
  )
}

export default connect()(Routes)
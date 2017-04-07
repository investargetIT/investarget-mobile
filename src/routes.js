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
import { readUserInfoFromLocalStorage, handleError, receiveContinentsAndCountries, receiveIndustries } from './actions'
import Filter from './containers/Filter'
import { receivePosts } from './actions'
import api from './api'
import TimelineManagement from './components/TimelineManagement'
import ChatInvestor from './containers/ChatInvestor'
import ChatTrader from './containers/ChatTrader'
import UserInfo from './containers/UserInfo'
import EditTimeline from './containers/EditTimeline'

const Routes = (props) => {

  api.getPostsAndEvent(
    posts => props.dispatch(receivePosts(posts)),
    error => props.dispatch(handleError(error))
  )

  props.dispatch(readUserInfoFromLocalStorage())

  api.getContinentsAndCountries(
    continentsAndCountries => props.dispatch(receiveContinentsAndCountries(continentsAndCountries)),
    error => console.error(error) 
  )

  api.getIndustries(
    industries => props.dispatch(receiveIndustries(industries)),
    error => console.error(error)
  )

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
        <Route path="/filter" component={Filter} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/timeline_management" component={TimelineManagement} />
        <Route path="/chat_investor" component={ChatInvestor} />
        <Route path="/chat_trader" component={ChatTrader} />
        <Route path="/user_info" component={UserInfo} />
        <Route path="/edit_timeline" component={EditTimeline} />

      </div>
    </Router>
  )
}

export default connect()(Routes)
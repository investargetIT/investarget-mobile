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
import { readUserInfoFromLocalStorage, handleError, receiveContinentsAndCountries, receiveIndustries, receiveTags, receiveTitles } from './actions'
import Filter from './containers/Filter'
import { receivePosts } from './actions'
import api from './api'
import TimelineManagement from './containers/TimelineManagement'
import ChatInvestor from './containers/ChatInvestor'
import ChatTrader from './containers/ChatTrader'
import UserInfo from './containers/UserInfo'
import EditTimeline from './containers/EditTimeline'
import RetrievePassword from './containers/RetrievePassword'
import Agreement from './containers/Agreement'
import SetPassword from './containers/SetPassword'
import MyInvestor from './containers/MyInvestor'
import Notification from './containers/Notification'
import MyTag from './containers/MyTag'
import MyFavoriteProject from './containers/MyFavoriteProject'
import ModifyPassword from './containers/ModifyPassword'
import ModifyBusinessCard from './containers/ModifyBusinessCard'
import Contact from './containers/Contact'
import OrganizationDetail from './containers/OrganizationDetail'
import Timeline from './containers/Timeline'
import LatestRemark from './containers/LatestRemark'

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

  api.getTags(
    tags => props.dispatch(receiveTags(tags)),
    error => console.error(error)
  )

  api.getTitles(
    titles => props.dispatch(receiveTitles(titles)),
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
        <Route path="/agreement" component={Agreement} />
        <Route path="/filter" component={Filter} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/timeline_management" component={TimelineManagement} />
        <Route path="/chat_investor" component={ChatInvestor} />
        <Route path="/chat_trader" component={ChatTrader} />
        <Route path="/user_info/:id" component={UserInfo} />
        <Route path="/edit_timeline/:id" component={EditTimeline} />
        <Route path="/retrieve_password" component={RetrievePassword} />
        <Route path="/set_password" component={SetPassword} />
        <Route path="/my_investor" component={MyInvestor} />
        <Route path="/notification" component={Notification} />
        <Route path="/my_tag" component={MyTag} />
        <Route path="/my_favorite_project" component={MyFavoriteProject} />
        <Route path="/modify_password" component={ModifyPassword} />
        <Route path="/modify_business_card" component={ModifyBusinessCard} />
        <Route path="/contact" component={Contact} />
        <Route path="/organization/:id" component={OrganizationDetail} />
        <Route path="/timeline/:id" component={Timeline} />
	<Route path="/latest_remark" component={LatestRemark} />

      </div>
    </Router>
  )
}

export default connect()(Routes)

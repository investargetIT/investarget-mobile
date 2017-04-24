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
import { readUserInfoFromLocalStorage, handleError, receiveContinentsAndCountries, receiveIndustries, receiveTags, receiveTitles, receiveCurrentUserInfo } from './actions'
import Filter from './containers/Filter'
import { receivePosts } from './actions'
import api from './api'
import TimelineManagement from './containers/TimelineManagement'
import Chat from './containers/Chat'
import UserInfo from './containers/UserInfo'
import EditTimeline from './containers/EditTimeline'
import RetrievePassword from './containers/RetrievePassword'
import Agreement from './containers/Agreement'
import SetPassword from './containers/SetPassword'
import MyPartener from './containers/MyPartener'
import Notification from './containers/Notification'
import MyTag from './containers/MyTag'
import MyFavoriteProject from './containers/MyFavoriteProject'
import ModifyPassword from './containers/ModifyPassword'
import ModifyBusinessCard from './containers/ModifyBusinessCard'
import Contact from './containers/Contact'
import OrganizationDetail from './containers/OrganizationDetail'
import Timeline from './containers/Timeline'
import LatestRemark from './containers/LatestRemark'
import NotificationDetail from './containers/NotificationDetail'
import SelectUser from './containers/SelectUser'

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

  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    const param = { 
      mobileOrEmailAddress: user.username,
      password: user.password,
      app: 3
    }
    api.loginAndGetUserInfo(
      param,
      (authToken, userInfo) => props.dispatch(receiveCurrentUserInfo(authToken, userInfo, user.username, user.password)),
      error => console.error(error)
    )   
  }

  return (
    <Router>
      <div id="container">

        <LoadingAndToast />
        <HandleError />


        <Route exact path={api.baseUrl + "/"} component={App} />
        <Route path={api.baseUrl + "/posts"} component={Posts} />
	<Route path={api.baseUrl + "/events"} component={Events} />
        <Route path={api.baseUrl + "/user"} component={User} />
        <Route path={api.baseUrl + "/login"} component={Login} />
        <Route path={api.baseUrl + "/register"} component={Register} />
        <Route path={api.baseUrl + "/register2"} component={Register2} />
        <Route path={api.baseUrl + "/agreement"} component={Agreement} />
        <Route path={api.baseUrl + "/filter"} component={Filter} />
        <Route path={api.baseUrl + "/project/:id/:token?"} component={ProjectDetail} />
        <Route path={api.baseUrl + "/timeline_management" } component={TimelineManagement} />
        <Route path={api.baseUrl + "/chat/:id" } component={Chat} />
        <Route path={api.baseUrl + "/user_info/:id" } component={UserInfo} />
        <Route path={api.baseUrl + "/edit_timeline/:id" } component={EditTimeline} />
        <Route path={api.baseUrl + "/retrieve_password" } component={RetrievePassword} />
        <Route path={api.baseUrl + "/set_password" } component={SetPassword} />
        <Route path={api.baseUrl + "/my_partener" } component={MyPartener} />
        <Route path={api.baseUrl + "/notification" } component={Notification} />
        <Route path={api.baseUrl + "/my_tag" } component={MyTag} />
        <Route path={api.baseUrl + "/my_favorite_project" } component={MyFavoriteProject} />
        <Route path={api.baseUrl + "/modify_password" } component={ModifyPassword} />
        <Route path={api.baseUrl + "/modify_business_card" } component={ModifyBusinessCard} />
        <Route path={api.baseUrl + "/contact" } component={Contact} />
        <Route path={api.baseUrl + "/organization/:id" } component={OrganizationDetail} />
        <Route path={api.baseUrl + "/timeline/:id" } component={Timeline} />
	      <Route path={api.baseUrl + "/latest_remark" } component={LatestRemark} />
	      <Route path={api.baseUrl + "/notifications/:id" } component={NotificationDetail} />
        <Route path={api.baseUrl + "/select_user" } component={SelectUser} />

      </div>
    </Router>
  )
}

export default connect()(Routes)

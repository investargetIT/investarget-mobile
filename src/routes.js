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
import Toast from './containers/Toast'
import Login from './containers/Login'
import Register from './containers/Register'
import Register2 from './containers/Register2'
import ProjectDetail from  './containers/ProjectDetail'
import { connect } from 'react-redux'
import { readUserInfoFromLocalStorage, handleError, receiveContinentsAndCountries, receiveIndustries, receiveTags, receiveTitles, receiveCurrentUserInfo } from './actions'
import Filter from './containers/Filter'
import { receivePosts } from './actions'
import api from './api'
import * as newApi from './api3.0'
import { getContinentsAndCountries, getIndustries, getTags, getTitles } from './utils'
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
import AddInvestor from './containers/AddInvestor'

const Routes = (props) => {

  api.getPostsAndEvent(
    posts => props.dispatch(receivePosts(posts)),
    error => props.dispatch(handleError(error))
  )

  props.dispatch(readUserInfoFromLocalStorage())


  getContinentsAndCountries().then(continentsAndCountries => {
    props.dispatch(receiveContinentsAndCountries(continentsAndCountries))
  })

  getIndustries().then(industries => {
    props.dispatch(receiveIndustries(industries))
  })

  getTags().then(tags => {
    props.dispatch(receiveTags(tags))
  })

  getTitles().then(titles => {
    props.dispatch(receiveTitles(titles))
  })



  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    const param = { 
      username: user.username,
      password: user.password,
      // app: 3
    }
    newApi.login(param)
      .then(data => {
        const { token: authToken, user_info: userInfo } = data.data
        props.dispatch(receiveCurrentUserInfo(authToken, userInfo, user.username, user.password))
      })
      .catch(error => console.error(error))
  }

  return (
    <Router>
      <div id="container">

        <LoadingAndToast />
        <HandleError />
        <Toast />


        <Route exact path={api.baseUrl + "/"} component={App} />
        <Route path={api.baseUrl + "/posts"} component={Posts} />
        <Route path={api.baseUrl + "/events"} component={Events} />
        <Route path={api.baseUrl + "/user"} component={User} />
        <Route path={api.baseUrl + "/login"} component={Login} />
        <Route path={api.baseUrl + "/register"} component={Register} />
        <Route path={api.baseUrl + "/register2"} component={Register2} />
        <Route path={api.baseUrl + "/agreement"} component={Agreement} />
        <Route path={api.baseUrl + "/filter"} component={Filter} />
        <Route path={api.baseUrl + "/project/:id"} component={ProjectDetail} />
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
        <Route path={api.baseUrl + "/add_investor" } component={AddInvestor} />

      </div>
    </Router>
  )
}

export default connect()(Routes)

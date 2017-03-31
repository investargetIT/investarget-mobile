import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './components/App'
import Posts from './components/Posts'
import Events from './components/Events'
import User from './components/User'
import LoadingAndToast from './components/LoadingAndToast'
import Login from './components/Login'
import Register from './components/Register'
import Register2 from './components/Register2'
import { connect } from 'react-redux'
import { readUserInfoFromLocalStorage } from './actions'
import MasterDetail from './components/MasterDetail'
import axios from 'axios'
import { receivePosts } from './actions'

const Routes = (props) => {

  axios.get('http://192.168.1.253:8082/api/services/InvestargetApi/activityPicture/GetActivitypictures')
    .then(response => {
      if (response.data.success) {
        var result = response.data.result.map(item => {
          var obj = {}
          obj['title'] = item.title
          obj['imgUrl'] = item.url
          obj['detailUrl'] = item.detailUrl
          obj['isNews'] = item.isNews
          return obj
        })
        props.dispatch(receivePosts(result))
      } else {
        throw response.data.error
      }
    })
    .catch(error => console.error(error))

  props.dispatch(readUserInfoFromLocalStorage())

  return (
    <Router>
      <div id="container">

        <LoadingAndToast />

        <Route exact path="/" component={App} />
        <Route path="/posts" component={Posts} />
        <Route path="/events" component={Events} />
        <Route path="/user" component={User} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/register2" component={Register2} />
        <Route path="/filter" component={MasterDetail} />

      </div>
    </Router>
  )
}

export default connect()(Routes)
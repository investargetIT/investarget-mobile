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
import { connect } from 'react-redux'
import { readUserInfoFromLocalStorage } from './actions'
import MasterDetail from './components/MasterDetail'

const Routes = (props) => {

  props.dispatch(readUserInfoFromLocalStorage())

  return (
    <Router>
      <div>

        <LoadingAndToast />

        <Route exact path="/" component={App} />
        <Route path="/posts" component={Posts} />
        <Route path="/events" component={Events} />
        <Route path="/user" component={User} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/filter" component={MasterDetail} />

      </div>
    </Router>
  )
}

export default connect()(Routes)
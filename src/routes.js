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

const Routes = () => (
  <Router>
    <div>

      <LoadingAndToast />

      <Route exact path="/" component={App} />
      <Route path="/posts" component={Posts} />
      <Route path="/events" component={Events} />
      <Route path="/user" component={User} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

    </div>
  </Router>
)

export default Routes
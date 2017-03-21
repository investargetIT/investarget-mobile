import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './components/App'
import Posts from './components/Posts'
import Events from './components/Events'
import User from './components/User'
import Loading from './components/Loading'
import Login from './components/Login'

const Routes = () => (
  <Router>
    <div>

      <Loading />

      <Route exact path="/" component={App} />
      <Route path="/posts" component={Posts} />
      <Route path="/events" component={Events} />
      <Route path="/user" component={User} />
      <Route path="/login" component={Login} />

    </div>
  </Router>
)

export default Routes
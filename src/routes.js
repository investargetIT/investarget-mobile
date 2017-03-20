import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './components/App'
import Posts from './components/Posts'
import Events from './components/Events'
import TabBar from './components/TabBar'
import User from './components/User'
import Loading from './components/Loading'

const Routes = () => (
  <Router>
    <div>

      <Loading />

      <Route exact path="/" component={App}/>
      <Route path="/posts" component={Posts}/>
      <Route path="/events" component={Events}/>
      <Route path="/user" component={User} />

      <TabBar />
    </div>
  </Router>
)

export default Routes
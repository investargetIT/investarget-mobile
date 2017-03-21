import React from 'react'
import { Link } from 'react-router-dom'
import TabBar from './TabBar'

function User(props) {
  return (
    <div>
      <h1>个人中心</h1>
      <Link to="/login">Login</Link>
      <TabBar />
    </div>
  )
}

export default User
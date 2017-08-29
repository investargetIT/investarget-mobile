import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes'
import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'

window.LANG = 'cn'
localStorage.setItem('source', 1)
window.echo = function () {
  const args = [...arguments];
  args.unshift('%cLOG', 'color: white; font-weight: bold; background-color: black; padding: 3px')
  console.log.apply(console, args);
  // TODO: add caller position including file name and line number
}
const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    loggerMiddleware
  )
)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)

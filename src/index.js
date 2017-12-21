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
function whichEngine() {
  if (!'WebkitAppearance' in document.documentElement.style) return;
  const v8string = 'function%20javaEnabled%28%29%20%7B%20%5Bnative%20code%5D%20%7D';
  return escape(navigator.javaEnabled.toString()) === v8string ? 'V8' : 'JSC';
}
function echo() {
  let caller = 'LOG';
  // switch (whichEngine()) {
  //   case 'V8':
  //     caller = (new Error).stack.split('\n')[2].match(/at (.*) \(/)[1];
  //     break;
  //   case 'JSC':
  //     caller = (new Error).stack.split('\n')[1].match(/(.*)@/)[1];
  //     break;
  // }
  const args = [...arguments];
  args.unshift(`%c${caller}`, 'color: white; font-weight: bold; background-color: black; padding: 3px')
  console.log.apply(console, args);
  // TODO: add caller position including file name and line number
}
window.echo = echo
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

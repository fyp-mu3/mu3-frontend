import React from 'react'
import { Router, Route } from 'react-router'
import App from '../components/app'
import NotFound from '../components/notfound'
import AuthScreen from '../components/AuthScreen'

const _Router = (history) => {
  return (
    <Router history={history}>
      <Route path='/' component={App} />
      <Route path='/login' component={AuthScreen} />
      <Route path='/notfound' component={NotFound} />
    </Router>
  )
}

export default _Router

import React from 'react'
import { Router, Route, IndexRoute, Redirect } from 'react-router'
import App from '../components/app'
import NotFound from '../components/notfound'
import AuthScreen from '../components/AuthScreen'
import Home from '../components/Home'

const _Router = (history) => {
  return (
    <Router history={history}>

      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='/home' component={Home} />
        <Route path='/notfound' component={NotFound} />
      </Route>

      <Route path='/login' component={AuthScreen} />
      <Route path='/notfound' component={NotFound} />
    </Router>
  )
}

export default _Router

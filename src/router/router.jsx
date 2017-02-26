import React from 'react'
import { Router, Route, IndexRoute, Redirect } from 'react-router'
import App from '../components/app'
import NotFound from '../components/notfound'
import AuthScreen from '../components/AuthScreen'
import HomeScreen from '../components/HomeScreen'
import CodeChallengesScreen from '../components/CodeChallengesScreen'
import CodeChallengeView from '../components/CodeChallengeView'

const _Router = (history) => {
  return (
    <Router history={history}>

      <Route path='/' component={App}>
        <IndexRoute component={HomeScreen} />
        <Route path='/home' component={HomeScreen} />
        <Route path='/forms' component={NotFound} />
        <Route path='/codeChallenges' component={CodeChallengesScreen} />
        <Route path='/codeChallenges/:id' component={CodeChallengeView} />
        <Route path='/notfound' component={NotFound} />
      </Route>

      <Route path='/login' component={AuthScreen} />
      <Route path='/notfound' component={NotFound} />
    </Router>
  )
}

export default _Router

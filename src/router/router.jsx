import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from '../components/app'
import NotFound from '../components/notfound'
import AuthScreen from '../components/AuthScreen'
import HomeScreen from '../components/HomeScreen'
import CodeChallengesScreen from '../components/CodeChallengesScreen'
import CodeChallengeView from '../components/CodeChallengeView'
import JobScreen from '../components/JobScreen'
import Logout from '../components/Logout'
import HRScreen from '../components/HRScreen'
import CompanyAdminScreen from '../components/CompanyAdminScreen'
import JobAdminScreen from '../components/JobAdminScreen'

const _Router = (history) => {
  return (
    <Router history={history}>

      <Route path='/' component={App}>
        <IndexRoute component={HomeScreen} />
        <Route path='/home' component={HomeScreen} />
        <Route path='/forms' component={NotFound} />
        <Route path='/codeChallenges' component={CodeChallengesScreen} />
        <Route path='/codeChallenges/:id' component={CodeChallengeView} />
        <Route path='/jobs' component={JobScreen} />
        <Route path='/jobs/:id' component={JobScreen} />
        <Route path='/notfound' component={NotFound} />
        <Route path='/hr' component={HRScreen} />
        <Route path='/hr/view' component={CompanyAdminScreen} />
        <Route path='/hr/job' component={JobAdminScreen} />
      </Route>

      <Route path='/login' component={AuthScreen} />
      <Route path='/notfound' component={NotFound} />
      <Route path='/logout' component={Logout} />
    </Router>
  )
}

export default _Router

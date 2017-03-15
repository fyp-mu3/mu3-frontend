// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'
import { SessionActions } from '../reducers/SessionRedux'
import { AppActions } from '../reducers/AppRedux'

import NavigationLeft from './NavigationLeft'
import NavigationTop from './NavigationTop'
import RegisterScreen from './RegisterScreen'

import Metrics from '../common/Metrics'

import { Thunk } from '../reducers/CodeChallengesRedux'

import Api from '../common/Api'

import Loading from 'halogen/PulseLoader'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.fetchCodeChallenges(0)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.session.passport) {
      this.props.goAuth()
    } else {
      if (nextProps.session.needVerify) {
        let emailAddress = nextProps.session.passport.user.extractedUser.emailAddress
        this._checkRegistered(emailAddress)
      }

      if (nextProps.session.passport.user && nextProps.session.passport.user.extractedUser.emailAddress && !this.props.app.user) {
        this.props.dispatch(AppActions.updateUser(nextProps.session.passport.user.extractedUser.emailAddress))
      }
    }
  }

  _checkRegistered (emailAddress: string) {
    this.props.dispatch(SessionActions.verifySession(emailAddress))
  }

  _renderSessionInfo () {
    return (
      <div>
        {JSON.stringify(this.props.session)}
      </div>
    )
  }

  _renderMainContent (route) {
    return (
      <div className='container' style={{overflowX: 'hidden', margin: Metrics.baseMargin}}>
        {this.props.children}
      </div>
    )
  }

  _renderLoadingSpinner () {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100wh'}}>
        <Loading color="#26A65B" size="16px" margin="4px"/>
      </div>
    )
  }

  _renderRegisterScreen () {
    return <RegisterScreen />
  }

  render () {
    if (this.props.app.showRegisterScreen) {
      return this._renderRegisterScreen()
    }

    return (
      /* render main wrapper, behave like a ScrollView */
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100wh',
        overflow: 'hidden'
      }}>
        <NavigationLeft />
        {/* render right wrapper */}
        <div style={{flexGrow: 1, height: '100vh', overflowY: 'scroll'}}>
          <NavigationTop />
          {/* render main content */}
          {this._renderMainContent(this.props.router)}
        </div>
      </div>
    )
  }
  // <div style={{display: 'flex', flexDirection: 'column'}}>
  //   <h1>It Works!</h1>
  //   <p>This React project just works including <span className='redBg'>module</span> local styles.</p>
  //   <p>Enjoy!!!</p>
  //   <a href='http://localhost:3000/auth/linkedin'>Login with LinkedIn</a>
  //   <Link to={'/notfound'}>Not Found</Link>
  //   <button onClick={() => this.props.logout()}>Logout</button>
  //   {this._renderSessionInfo()}
  // </div>
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) },
    goAuth: () => dispatch(routerActions.replace('/login')),
    logout: () => dispatch(SessionActions.destroySession()),
    fetchCodeChallenges: (offset: number) => {
      dispatch(Thunk.fetch(offset))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    app: state.app,
    session: state.session
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'
import { SessionActions } from '../reducers/SessionRedux'

import NavigationLeft from './NavigationLeft'
import NavigationTop from './NavigationTop'

import Metrics from '../common/metrics'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.session.passport) {
      this.props.goAuth()
    }
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

  render () {
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
    logout: () => dispatch(SessionActions.destroySession())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

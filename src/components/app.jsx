import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'
import { SessionActions } from '../reducers/SessionRedux'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.session.passport) {
      this.props.dispatch(routerActions.replace('/login'))
    }
  }

  _renderSessionInfo () {
    return (
      <div>
        {JSON.stringify(this.props.session)}
      </div>
    )
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h1>It Works!</h1>
        <p>This React project just works including <span className='redBg'>module</span> local styles.</p>
        <p>Enjoy!!!</p>
        <a href='http://localhost:3000/auth/linkedin'>Login with LinkedIn</a>
        <Link to={'/notfound'}>Not Found</Link>
        <button onClick={() => this.props.logout()}>Logout</button>
        {this._renderSessionInfo()}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) },
    goAuth: () => dispatch(routerActions.replace('/notfound')),
    logout: () => dispatch(SessionActions.destroySession())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

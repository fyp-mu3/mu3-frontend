import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    if (!this.props.session.passport) {
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

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h1>It Works!</h1>
        <p>This React project just works including <span className="redBg">module</span> local styles.</p>
        <p>Enjoy!!!</p>
        <a href='http://localhost:3000/auth/linkedin'>Login with LinkedIn</a>
        <Link to={'/notfound'}>Not Found</Link>
        {this._renderSessionInfo()}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) },
    goAuth: () => dispatch(routerActions.replace('/login'))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

import React from 'react'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'

class AuthScreen extends React.Component {
  constructor (props) {
    super(props)

    let session = this._decodeSessionFromURL()

    let _state = {
      validatingSession: false,
      hasSession: false
    }

    if (session) {
      _state.validatingSession = true
      _state.hasSession = true
    } else {
      _state.hasSession = false
    }

    this.state = _state
  }

  _decodeSessionFromURL () {
    if (!this.props.router || !this.props.router.location) { return null }

    if (this.props.router.location.query && this.props.router.location.query.session) {
      try {
        return JSON.parse(global.atob(this.props.router.location.query.session))
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }

  _validateSession (session) {

  }

  _renderValidatingSession () {

  }

  _renderLoginBox () {
    
  }

  render () {
    return (
      <div>
        <a href={'http://localhost:3000/auth/linkedin'}>Login with LinkedIn</a>
      </div>
    )
  }
}

export default AuthScreen

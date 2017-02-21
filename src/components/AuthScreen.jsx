import React from 'react'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'

class AuthScreen extends React.Component {
  constructor (props) {
    super(props)

    let session = this._decodeSessionFromURL()

    let _state = {
      validatingSession: false,
      session: null
    }

    if (session) {
      _state.validatingSession = true
      _state.session = session
      this._validateSession(session)
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
    setTimeout(() => {
      this.setState({
        validatingSession: false
      })
    }, 2000)
  }

  _renderValidatingSession () {
    if (this.state.validatingSession) {
      return (
        <div>
          Validating session ...
        </div>
      )
    } else {
      return (
        <div>
          {JSON.stringify(this.state.session)}
        </div>
      )
    }
  }

  _renderLoginBox () {
    return (
      <div>
        <a href={'http://localhost:3000/auth/linkedin'}>Login with LinkedIn</a>
      </div>
    )
  }

  render () {
    return this.state.session ? this._renderValidatingSession() : this._renderLoginBox()
  }
}

export default AuthScreen

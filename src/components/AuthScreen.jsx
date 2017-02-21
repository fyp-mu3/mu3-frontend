import React from 'react'
import { Link } from 'react-router'

class AuthScreen extends React.Component {
  render () {
    return (
      <div>
        <a href={'http://localhost:3000/auth/linkedin'}>Login with LinkedIn</a>
      </div>
    )
  }
}

export default AuthScreen

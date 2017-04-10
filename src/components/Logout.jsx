// @flow

import React from 'react'
import { connect } from 'react-redux'

import Loading from './Loading'

import { SessionActions } from '../reducers/SessionRedux'
import { routerActions } from 'react-router-redux'

class Logout extends React.Component {

  componentDidMount () {
    setTimeout(() => {
      this.props.logout()
    }, 1500)
  }

  render () {
    return (
      <div style={{display: 'flex', height: '100vh', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Loading />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(SessionActions.destroySession())
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)

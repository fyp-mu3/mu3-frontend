// @flow

import React from 'react'

import Metrics from '../common/Metrics'
import { SessionActions } from '../reducers/SessionRedux'
import { AppActions } from '../reducers/AppRedux'

import { connect } from 'react-redux'

import Loading from 'halogen/PulseLoader'
import SmallLoading from 'halogen/MoonLoader'

import Api from '../common/Api'

const CORNER_RADIUS = 8

class RegisterScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailAddress: null,
      displayName: null,
      loading: false
    }
  }

  _handleClickUpdateProfile () {
    this.setState({loading: true})

    Api.userUpdate({
      username: this.refs.emailAddressInput.value,
      firstName: this.refs.firstNameInput.value,
      lastName: this.refs.lastNameInput.value,
      emailAddress: this.refs.emailAddressInput.value
    })
    .then(user => {
      console.log(user)
      this.props.dispatch(AppActions.updateUser(user.emailAddress))
      setTimeout(() => {
        this.props.dispatch(SessionActions.verifySession(user.emailAddress))
      }, 2000)
    })
    .catch(err => console.error(err))
  }

  _renderLoading () {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100wh'}}>
        <Loading color='#26A65B' size='16px' margin='4px' />
      </div>
    )
  }

  _renderRegisterBox () {
    let user = this.props.passport.user.extractedUser

    return (
      <div style={{
        borderTopLeftRadius: CORNER_RADIUS,
        borderTopRightRadius: CORNER_RADIUS,
        borderBottomLeftRadius: CORNER_RADIUS,
        borderBottomRightRadius: CORNER_RADIUS,
        backgroundColor: 'white',
        minWidth: 200,
        padding: Metrics.doubleBaseMargin
      }}>
        <form style={{display: 'flex', flexDirection: 'column'}}>
          <div className='flex'>
            <input type='text' name='firstName' placeholder='First Name' disabled={this.state.loading} ref='firstNameInput' />
            <input type='text' name='lastName' placeholder='Last Name' disabled={this.state.loading} ref='lastNameInput' />
          </div>
          <input type='text' name='email' placeholder='Your email' value={user.emailAddress} disabled ref='emailAddressInput' />
          <div onClick={this._handleClickUpdateProfile.bind(this)} className='button is-outlined is-primary' type='button' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {
              function (loading) {
                return loading ? <SmallLoading color='#26A65B' size='16px' margin='4px' /> : <span>Update Profile</span>
              }(this.state.loading)
            }
          </div>
        </form>
      </div>
    )
  }

  render () {
    if (!this.props.passport) { return this._renderLoading() }

    // if (this.state.loading) { return this._renderLoading() }

    return (
      // container
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100wh', height: '100vh'}}>
        {this._renderRegisterBox()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    passport: state.session.passport
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => dispatch(action)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)

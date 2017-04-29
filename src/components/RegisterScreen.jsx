// @flow

import React from 'react'

import Metrics from '../common/Metrics'
import { SessionActions } from '../reducers/SessionRedux'
import { AppActions } from '../reducers/AppRedux'

import { connect } from 'react-redux'

import Loading from 'halogen/PulseLoader'
import SmallLoading from 'halogen/MoonLoader'

import Api from '../common/Api'

import LinkedInProfile from '../common/LinkedInProfileHelper'

import CardView from '../components/CardView'

import { routerActions } from 'react-router-redux'

import includes from 'lodash/includes'

import Fuse from 'fuse.js'
const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 100,
  minMatchCharLength: 1,
  keys: [
    "name",
    "abbr",
  ]
}

const CORNER_RADIUS = 8

class RegisterScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailAddress: this._getLinkedInProfileEmail(),
      loading: false,
      firstName: this._getLinkedInProfileFirstName(),
      lastName: this._getLinkedInProfileLastName(),
      showMBTIDetail: false,
      'education-name': ''
    }

    this._getLinkedInProfilePositions().forEach((position, index) => {
      this.state[`input-position-${index}-name`] = position.company.name,
      this.state[`input-position-${index}-title`] = position.title
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.linkedInProfile && this.props.linkedInProfile) {
      this.setState({
        emailAddress: this._getLinkedInProfileEmail(),
        loading: false,
        firstName: this._getLinkedInProfileFirstName(),
        lastName: this._getLinkedInProfileLastName()
      })

      this._getLinkedInProfilePositions().forEach((position, index) => {
        this.setState({
          [`input-position-${index}-name`]: position.company.name,
          [`input-position-${index}-title`]: position.title
        })
      })
    }
  }

  _handleChangeFocus (focused, event) {
    if (event.target) {
      this.setState({
        [`focus-${event.target.name}`]: focused
      })
    }
  }

  _handleInputChange (event) {
    if (event.target) {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  _handleClickUpdateProfile () {
    this.setState({loading: true})
    let _profile = this.props.linkedInProfile
    _profile.mbti = {
      e: this.state.mbti_e,
      n: this.state.mbti_n,
      t: this.state.mbti_t,
      j: this.state.mbti_j
    }
    _profile.education = {
      name: this.state['education-name'],
      department: this.state['education-department']
    }

    _profile.mapped_positions = []
    this._getLinkedInProfilePositions().forEach((position, index) => {
      _profile.mapped_positions.push(
        {
          name: this.state[`input-position-${index}-name`],
          title: this.state[`input-position-${index}-title`],
          category: this.state[`input-position-${index}-category`] ? this.state[`input-position-${index}-category`] : 'inhouse'
        }
      )
    })

    const isTop100u = includes(this.props.universities.map(item => item.name), this.state['education-name'])
    _profile.isTop100u = isTop100u

    Api.userUpdate({
      username: this.refs.emailAddressInput.value,
      firstName: this.refs.firstNameInput.value,
      lastName: this.refs.lastNameInput.value,
      emailAddress: this.refs.emailAddressInput.value,
      profile: _profile
    })
    .then(user => {
      console.log(user)
      this.props.dispatch(AppActions.updateUser(user.emailAddress))
      if (this.props.mode === 'editProfile') {
        this.props.dispatch(routerActions.replace('/home'))
      } else {
        setTimeout(() => {
          this.props.dispatch(SessionActions.verifySession(user.emailAddress))
        }, 2000)
      }
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

  _getLinkedInProfilePic () {
    if (this.props.linkedInProfile) {
      return this.props.linkedInProfile.profilePic
    }

    return null
  }

  _getLinkedInProfileFirstName () {
    if (this.props.linkedInProfile) {
      return this.props.linkedInProfile.firstName
    }
    return null
  }

  _getLinkedInProfileLastName () {
    if (this.props.linkedInProfile) {
      return this.props.linkedInProfile.lastName
    }
    return null
  }

  _getLinkedInProfileEmail () {
    if (this.props.linkedInProfile) {
      return this.props.linkedInProfile.emailAddress
    }

    return null
  }

  _getLinkedInProfileMBTI () {
    if (this.props.linkedInProfile) {
      return this.props.linkedInProfile.mbti
    }

    return {
      e: "0",
      n: "0",
      t: "0",
      j: "0"
    }
  }

  _getLinkedInProfilePositions () {
    if (this.props.linkedInProfile && this.props.linkedInProfile.positions) {
      return this.props.linkedInProfile.positions.values || []
    }

    return []
  }

  _renderRegisterBox () {
    let user = this.props.passport.user.extractedUser

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        borderTopLeftRadius: CORNER_RADIUS,
        borderTopRightRadius: CORNER_RADIUS,
        borderBottomLeftRadius: CORNER_RADIUS,
        borderBottomRightRadius: CORNER_RADIUS,
        backgroundColor: 'white',
        padding: Metrics.doubleBaseMargin,
        marginTop: Metrics.doubleBaseMargin,
        marginBottom: Metrics.doubleBaseMargin,
        width: '80%',
        maxWidth: 500
      }} className='container'>
        <h1 className='title'>Step 1</h1>
        <h2 className='subtitle'>Profile Information</h2>
        <hr />

        <div className='flex flexCol flexCenter'>
          <figure className='image is-128x128' style={{marginBottom: 32}}>
            <img src={this._getLinkedInProfilePic()} style={{borderRadius: 128 / 2}} />
          </figure>
          <div className='field'>
            <p className='control'><input type='text' className='input' name='firstName' placeholder='First Name' disabled={this.state.loading} ref='firstNameInput' value={this.state.firstName} onChange={this._handleInputChange.bind(this)} /></p>
          </div>
          <div className='field'>
            <p className='control'><input type='text' className='input' name='lastName' placeholder='Last Name' disabled={this.state.loading} ref='lastNameInput' value={this.state.lastName} onChange={this._handleInputChange.bind(this)} /></p>
          </div>
          <div className='field' style={{marginBottom: 32}}>
            <input type='text' className='input' name='emailAddress' placeholder='Your email' value={this.state.emailAddress} disabled ref='emailAddressInput' onChange={this._handleInputChange.bind(this)} />
          </div>
        </div>

        <hr />
        <h1 className='title'>Step 2</h1>
        <h2 className='subtitle'>MBTI</h2>

        <div className='message'><div className='message-body'><a href='#'>why we need this ?</a></div></div>

        {this._renderMBTIPicker()}

        <hr />

        <h1 className='title'>Step 3</h1>
        <h2 className='subtitle'>Experience</h2>

        {this._renderExperienceForm()}
        <hr />

        <button
          onClick={this._handleClickUpdateProfile.bind(this)}
          className='button is-outlined is-primary'
          type='button'
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}
          disabled={!this._validateAllRequiredFields()}
          >
          {
            (function (loading) {
              return loading ? <SmallLoading color='#26A65B' size='16px' margin='4px' /> : <span>Update Profile</span>
            }(this.state.loading))
          }
        </button>
      </div>
    )
  }

  _handleMBTIChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  _validateAllRequiredFields () {
    if (!this.state.emailAddress) { return false }

    if (!this.state.firstName || this.state.firstName.length === 0) { return false }

    if (!this.state.lastName || this.state.firstName.length === 0) { return false }

    if (!this.state.mbti_e) { return false }

    if (!this.state.mbti_j) { return false }

    if (!this.state.mbti_n) { return false }

    if (!this.state.mbti_t) { return false }

    return true
  }

  _renderMBTIPicker () {
    return (
      <table className='table mbti-table'>
        <thead>
          <tr>
            <th>MBTI Type</th>
            <th></th>
            <th></th>
            <th>MBTI Type</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>MBTI Type</th>
            <th></th>
            <th></th>
            <th>MBTI Type</th>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>Extraversion</td>
            <td><input type='radio' name='mbti_e' value='1' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td><input type='radio' name='mbti_e' value='0' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td>Introversion</td>
          </tr>
          <tr>
            <td>Intuition</td>
            <td><input type='radio' name='mbti_n' value='1' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td><input type='radio' name='mbti_n' value='0' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td>Sensing</td>
          </tr>
          <tr>
            <td>Thinking</td>
            <td><input type='radio' name='mbti_t' value='1' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td><input type='radio' name='mbti_t' value='0' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td>Feeling</td>
          </tr>
          <tr>
            <td>Judging</td>
            <td><input type='radio' name='mbti_j' value='1' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td><input type='radio' name='mbti_j' value='0' onChange={this._handleMBTIChange.bind(this)} /></td>
            <td>Perceiving</td>
          </tr>
        </tbody>
      </table>
    )
  }

  _shouldShowAutoComplete () {
    if (this.state['focus-education-name'] && this.state['education-name']) {
      let input = this.state['education-name']
      let fuse = new Fuse(this.props.universities, fuseOptions)
      let items = fuse.search(input)
      return (items.length > 0)
    }

    return false
  }

  _renderUniversityAutoComplete () {
    let shouldShow = this._shouldShowAutoComplete()

    let input = this.state['education-name']
    let fuse = new Fuse(this.props.universities, fuseOptions)
    let items = fuse.search(input)

    return (
      <div className='flex flexCol' style={{position: 'absolute', width: 250, height: 300, backgroundColor: 'white', left: 0, zIndex: 999, border: '1px solid #E6E9ED', padding: 16, overflowY: 'scroll', display: shouldShow ? 'flex' : 'none'}}>
        <table className='table'><tbody>
        {
          items.map((item, index) => {
            return <tr key={`universities-${index}`}><td onMouseDown={() => this.setState({'education-name': item.name})}><a>{item.name}</a></td></tr>
          })
        }
        </tbody></table>
      </div>
    )
  }

  _renderExperienceForm () {
    return (
      <div className='flex flexCol'>
        <div className='field'>
          <label className='label'>Education</label>
          <div className='field-body'>
            <div className='field'>
              <div className='control'>
                <input className='input' type='text' placeholder='University of ...' name='education-name' onChange={this._handleInputChange.bind(this)} value={this.state['education-name']} onFocus={this._handleChangeFocus.bind(this, true)} onBlur={this._handleChangeFocus.bind(this, false)} />
                {this._renderUniversityAutoComplete()}
              </div>
            </div>
            <div className='field'>
              <p className='control'>
                <span className='select'>
                  <select name='education-department' onChange={this._handleInputChange.bind(this)}>
                    <option>Department</option>
                    <option value='cs'>Computer Science</option>
                    <option value='bm'>Business Management</option>
                    <option value='engi'>Engineering</option>
                    <option value='math'>Mathematics</option>
                    <option value='huma'>Humanities</option>
                    <option value='phys'>Physics</option>
                  </select>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='field'>
          <label className='label'>Working Experiences</label>
        </div>
        {
          this._getLinkedInProfilePositions().map((item, index) => {
            return <div key={`experience-history-row-${index}`}>{this._renderPositionRow(item, index)}</div>
          })
        }
      </div>
    )
  }

  _renderPositionRow (position, id) {
    return (
      <CardView>
        <div className='field'>
          <label className='label'>Company name</label>
          <p className='control'><input className='input' type='text' placeholder='Company name' value={this.state[`input-position-${id}-name`]} name={`input-position-${id}-name`} onChange={this._handleInputChange.bind(this)} /></p>
        </div>
        <div className='field'>
          <label className='label'>Title</label>
          <p className='control'><input className='input' type='text' placeholder='Title' value={this.state[`input-position-${id}-title`]} name={`input-position-${id}-title`} onChange={this._handleInputChange.bind(this)} /></p>
        </div>
        <div className='field'>
          <label className='label'>Category</label>
          <div className='control'>
            <div className='select'>
              <select name={`input-position-${id}-category`} onChange={this._handleInputChange.bind(this)}>
                <option value='inhouse' selected={this.state[`input-position-${id}-category`] === 'inhouse'}>In house development</option>
                <option value='cf' selected={this.state[`input-position-${id}-category`] === 'cf'}>Client facing</option>
              </select>
            </div>
          </div>
        </div>
      </CardView>
    )
  }

  render () {
    if (!this.props.passport) { return this._renderLoading() }

    // if (this.state.loading) { return this._renderLoading() }

    return (
      // container
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {this._renderRegisterBox()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    passport: state.session.passport,
    linkedInProfile: state.session.passport ? new LinkedInProfile(state.session.passport.user) : null,
    universities: state.app.universities || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => dispatch(action)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)

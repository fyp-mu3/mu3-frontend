// @flow

import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import PositionListView from './PositionsListView'
import Loading from './Loading'

import JobHelper from '../common/JobHelper'
import { Job } from '../models/Types'

class JobScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  _onApplyButtonClick (event) {
    this.setState({
      loading: true
    })

    JobHelper.applyWithId(this.props.job.id, this.props.app.user.emailAddress)
  }

  _renderJobList () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <PositionListView />
      </div>
    )
  }

  _renderJobTitle () {
    return (
      <h1>{this.props.job.title}</h1>
    )
  }

  _renderJobInfo () {
    const job = this.props.job
    return (
      <CardView renderHeader={this._renderJobTitle.bind(this)}>
        <div className='content'>{job.description}</div>
        { this.state.loading ?
          <Loading color='#26A65B' size='8px' margin='4px' /> :
          <button
            className='button is-primary'
            type='button'
            onClick={this._onApplyButtonClick.bind(this)}>Apply</button>
        }
      </CardView>
    )
  }

  render () {
    if (this.props.job) {
      return this._renderJobInfo()
    }
    return this._renderJobList()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
    job: state.jobs ? JobHelper.findJobWithId(state.jobs.viewJobId, state.jobs) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobScreen)

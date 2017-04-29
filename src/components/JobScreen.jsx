// @flow

import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import PositionListView from './PositionsListView'
import Loading from './Loading'

import JobHelper from '../common/JobHelper'
import { Job } from '../models/Types'

import { JobsActions } from '../reducers/JobsRedux'

import JobItemView from './JobItemView'

class JobScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  _onApplyButtonClick (event) {
    // JobHelper.applyWithId(this.props.job.id, this.props.app.user.emailAddress)
    this.props.applyJob(this.props.job.id)
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
      <h1>{this.props.job.company.name} - {this.props.job.title}</h1>
    )
  }

  _renderJobInfo () {
    const job = this.props.job
    return (
      <CardView renderHeader={this._renderJobTitle.bind(this)}>
        <div className='field'>
          <label className='label'>Title</label>
          <input className='input' disabled type='text' value={job.title} />
        </div>
        <div className='field'>
          <label className='label'>Description</label>
          <input className='input' disabled type='text' value={job.description} />
        </div>
        <div className='field'>
          <label className='label'>Salary</label>
          <input className='input' disabled type='text' value={job.salary} />
        </div>

        {this._renderActionButton()}
      </CardView>
    )
  }

  _renderActionButton () {
    if (this.state.loading) {
      return (
        <Loading color='#26A65B' size='8px' margin='4px' />
      )
    }
    
    if (this.props.job.canApply) {
      return (
        <button
          className='button is-primary'
          type='button'
          disabled={this.props.job.applied}
          onClick={this._onApplyButtonClick.bind(this)}>{this.props.job.applied ? 'Applied' : 'Apply'}</button>
      )
    } else {
      return (
        <button
          className='button is-warning'
          type='button'
          disabled>This job required rank <b>{JobHelper.letterRank(this.props.job.rankRequired)}</b></button>
      )
    }
  }

  render () {
    if (this.props.job) {
      return (
        <div className='flex flexCol'>
          <JobItemView job={this.props.job} full />
          <hr />
          {this._renderActionButton()}
        </div>
      )
    }

    return this._renderJobList()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    applyJob: (jobId) => { dispatch(JobsActions.apply(jobId)) }
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
    job: state.jobs ? JobHelper.findJobWithId(state.jobs.viewJobId, state.jobs) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobScreen)

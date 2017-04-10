import React from 'react'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'

import { Company, Job, User } from '../models/Types'

import CardView from './CardView'
import ListView from './ListView'

import { head } from 'lodash'

class JobAdminScreen extends React.Component {
  componentWillReceiveProps (newProps) {
    if (!newProps.job) {
      this.props.backToList()
    }
  }

  _renderApplicant (data: User, rowID, sectionID) {
    return (
      <CardView>{data.firstName} {data.lastName}</CardView>
    )
  }

  _renderApplicantsList () {
    return (
      <ListView
        dataSource={this.props.job.applicants}
        renderRow={this._renderApplicant.bind(this)} />
    )
  }

  _renderEditJobPannel () {

  }

  render () {
    if (!this.props.job) {
      return <div>Back</div>
    }

    return (
      <div className='flexColumn'>
        <CardView>{JSON.stringify(this.props.job)}</CardView>
        <CardView title='Applicants'>
          {this._renderApplicantsList()}
        </CardView>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const selectJob = (state) => {
    if (state.jobs.adminViewJobId) {
      return head(state.jobs.items.filter(item => item.id === state.jobs.adminViewJobId))
    } else {
      return null
    }
  }

  return {
    job: selectJob(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    backToList: () => { dispatch(routerActions.replace('/hr')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobAdminScreen)

// @flow

import React from 'react'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'

import { Company, Job } from '../models/Types'

import CardView from './CardView'
import ListView from './ListView'

import { JobsActions } from '../reducers/JobsRedux'

const selectJobsByCompany = (jobs, company) => {
  return jobs.filter((job) => {
    return job.company.id === company.id
  })
}

type State = {
  showCreateJobPanel: boolean
}

class CompanyAdminScreen extends React.Component {
  state: State;

  constructor (props) {
    super(props)

    this.state = {
      showCreateJobPanel: false      
    }
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.adminViewCompanyId) {
      this.props.back()
    }
  }

  company () {
    const result = this.props.companies.filter((company) => {
      return company.id === this.props.adminViewCompanyId
    })

    if (result.length > 0) {
      return result[0]
    } else {
      return null
    }
  }

  _renderJobRow (data: Job, rowID, sectionID) {
    return (
      <CardView>
        <div className='flex'>
          {data.title}
          <div className='spacer' />
          <button className='button is-info' onClick={() => {this.props.adminViewJob(data.id)}}>View</button>
        </div>
      </CardView>
    )
  }

  _renderPostedJobs () {
    const header = () => {
      return (
        <div className='flex'>
          <h1>Listed Jobs</h1>
          <div className='spacer' />
          <button className='button is-primary' onClick={() => this.setState({showCreateJobPanel: true})}><span className='icon'><i className="fa fa-plus" aria-hidden="true" /></span></button>
        </div>
      )
    }

    return (
      <CardView
        renderHeader={header}
      >
        <ListView
          dataSource={selectJobsByCompany(this.props.jobs.items, this.company())}
          renderRow={this._renderJobRow.bind(this)}
        />
      </CardView>
    )
  }

  _renderCreateJobPanel () {
    return (
      <CardView title='Create Job'>
        <div className='field'>
          <label className='label'>Name</label>
          <p className='control'>
            <input className='input' type='text' value={this.state.inputName} onChange={this._handleInputChange.bind(this)} name='inputName'/>
          </p>
        </div>

        <div className='field'>
          <label className='label'>Name</label>
          <p className='control'>
            <input className='input' type='text' value={this.state.inputName} onChange={this._handleInputChange.bind(this)} name='inputName'/>
          </p>
          <label className='label'>Description</label>
          <p className='control'>
            <textarea className='textarea' type='text' value={this.state.inputDescription} onChange={this._handleInputChange.bind(this)} name='inputDescription' />
          </p>
        </div>
      </CardView>
    )
  }

  _handleInputChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render () {
    if (!this.props.adminViewCompanyId) {
      return <div>Back</div>
    }

    let _company: Company = this.company()
    return (
      <div className='flexCol'>
        <CardView>
          <h1>{_company.name}</h1>
        </CardView>
        {this._renderPostedJobs()}
        {this.state.showCreateJobPanel && this._renderCreateJobPanel()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jobs: state.jobs,
    companies: state.companies.items,
    adminViewCompanyId: state.companies.adminViewCompanyId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    back: () => { dispatch(routerActions.replace('/hr')) },
    adminViewJob: (id) => { dispatch(JobsActions.adminViewJob(id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAdminScreen)

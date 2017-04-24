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
      showCreateJobPanel: false,
      inputRank: 's',
      showSuccessCreateNotification: false
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

  _renderSuccessCreateNotification () {
    return (
      <div className="notification is-primary">
        <button className="delete" onClick={() => this.setState({showSuccessCreateNotification: false})}></button>
        New job successfully posted.
      </div>
    )
  }

  _renderJobRow (data: Job, rowID, sectionID) {
    return (
      <CardView key={`company-admin-screen-${rowID}`}>
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
          <label className='label'>Salary</label>
          <p className='control has-icon'>
            <input className='input' type='text' value={this.state.inputSalary} onChange={this._handleInputChange.bind(this)} name='inputSalary'/>
            <span className='icon is-small'><i className='fa fa-usd' /></span>
          </p>
        </div>

        <div className='field'>
          <label className='label'>Description</label>
          <p className='control'>
            <textarea className='textarea' type='text' value={this.state.inputDescription} onChange={this._handleInputChange.bind(this)} name='inputDescription' />
          </p>
        </div>

        <div className='field'>
          <label className="label">Rank required</label>
          <p className='control'>
            <span className='select'>
              <select onChange={this._handleInputChange.bind(this)} value={this.state.inputRank} name='inputRank'>
                <option value='s'>S</option>
                <option value='a'>A</option>
                <option value='b'>B</option>
                <option value='c'>C</option>
              </select>
            </span>
          </p>
        </div>

        <div className='flex'>
          <div className='spacer' />
          <button className='button is-primary' onClick={this._handleCreateJob.bind(this)}>Create</button>
        </div>
      </CardView>
    )
  }

  _handleInputChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  _handleCreateJob () {
    let job = {
      title: this.state.inputName,
      salary: this.state.inputSalary,
      description: this.state.inputDescription,
      rankRequired: this.state.inputRank,
      company: this.props.adminViewCompanyId
    }

    console.info(job);

    setTimeout(() => {
      this.props.adminCreateJob(job)
      this.setState({
        showSuccessCreateNotification: true,
        showCreateJobPanel: false
      })
    }, 1500)
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
        {this.state.showSuccessCreateNotification && this._renderSuccessCreateNotification()}
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
    adminViewJob: (id) => { dispatch(JobsActions.adminViewJob(id)) },
    adminCreateJob: (job) => { dispatch(JobsActions.adminCreateJob(job)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAdminScreen)

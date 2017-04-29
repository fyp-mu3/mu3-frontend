import React from 'react'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'
import { JobsActions } from '../reducers/JobsRedux'
import { AppActions } from '../reducers/AppRedux'

import { Company, Job, User } from '../models/Types'

import CardView from './CardView'
import ListView from './ListView'
import RankLetter from './RankLetter'

import { head } from 'lodash'

import Loading from 'halogen/MoonLoader'

const TAB_APPLICANTS = 'applicants'
const TAB_RANKING = 'ranking'
const TAB_EDITJOB = 'editJob'

class JobAdminScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tab: TAB_EDITJOB,
      'update-ranking-industry': 'consult',
      isLoadingUpdateJob: false
    }
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.job) {
      this.props.backToList()
    }
  }

  componentDidMount () {
    if (this.props.job && this.props.job.applicants) {
      this.props.job.applicants.forEach(item => {
        this.props.updateApplicantRank(item.emailAddress)
      })
    }

    if (this.props.job) {
      const job: Job = this.props.job
      this.setState({
        'field-title': job.title,
        'field-salary': job.salary,
        'field-description': job.description,
        'field-rank': job.rankRequired,
        'field-location': job.location,
        'field-condition': job.condition,
        'field-skills': job.skills,
        'field-tags': job.tags
      })
    }
  }

  _renderApplicant (data: User, rowID, sectionID) {
    const renderHeader = () => {
      const displayName = `${data.firstName} ${data.lastName}`
      return (
        <div className='flex flexApplySpaceMargin flexCenterVertical'>
          <span><figure className='image is-64x64'><img src={data.profile.profilePic} style={{borderRadius: 64 / 2}} /></figure></span>
          <span><h2>{displayName}</h2></span>
          <div className='spacer' />
          <span><a className='button is-info' href={`${data.profile.linkedInUrl}`} target='_blank'>
            <span className='icon'><i className="fa fa-linkedin" aria-hidden="true"></i></span>
          </a></span>
          <span><a className='button is-primary' href={`mailto:${data.emailAddress}`} target='_blank'>
            <span className='icon'><i className="fa fa-envelope" aria-hidden="true"></i></span>
          </a></span>
        </div>
      )
    }

    return (
      <div className='columns' key={`job-admin-screen-applicant-${rowID}`}>
        <div className='column is-two-thirds'>
          <CardView renderHeader={renderHeader}>
            <div className='field is-horizontal'>
              <label className='label'>Education</label>
              <div className='field'>
                <p className='control'>
                  <input className='input' type='text' value={data.profile.education.name} disabled />
                </p>
              </div>
            </div>

            <label className='label'>Working Experiences</label>
            {
              data.profile.mapped_positions.map((item, index) => {
                return <div key={`working-position-${index}`}>{this._renderPositionRow(item)}</div>
              })
            }
          </CardView>
        </div>
        <div className='column'>　
          {this._renderApplicantAbilityView(data)}
        </div>
      </div>
    )
  }

  _renderApplicantAbilityView = (user) => {

    let ranking = this.props.ranking[user.emailAddress]

    if (!ranking) {
      return <div />
    }

    const renderApplicantRankingHeader = () => {
      return (
        <div className='flex' style={{alignItems: 'flex-end'}}>
          <h1>Ability</h1>
          <div className='spacer' />
          <RankLetter char={user.rank} />
        </div>
      )
    }

    return (
      <CardView renderHeader={renderApplicantRankingHeader}>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Code challenge</th>
            </tr>
          </thead>
          <tbody>
            {
              ranking.solvedChallenges.map((item, index) => {
                return (
                  <tr key={`job-admin-screen-applicant-${item.id}-${index}`}>
                    <td>{index}</td>
                    <td>{item.title}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </CardView>
    )
  }

  _renderPositionRow (position) {
    return (
      <CardView>
        <div className='field'>
          <label className='label'>Company Name</label>
          <p className='control'><input className='input' type='text' placeholder='Company name' disabled value={position.name} /></p>
        </div>
        <div className='field'>
          <label className='label'>Title</label>
          <p className='control'><input className='input' type='text' placeholder='Title' disabled value={position.title} /></p>
        </div>
      </CardView>
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

  _renderTabBar () {
    return (
      <div className='tabs is-toggle is-fullwidth'>
        <ul>
          <li className={this.state.tab === TAB_EDITJOB && 'is-active'}>
            <a onClick={() => this.setState({tab: TAB_EDITJOB})}><span>Information</span></a>
          </li>
          <li className={this.state.tab === TAB_APPLICANTS && 'is-active'}>
            <a onClick={() => this.setState({tab: TAB_APPLICANTS})}><span>Applicants</span></a>
          </li>
          <li className={this.state.tab === TAB_RANKING && 'is-active'}>
            <a onClick={() => this.setState({tab: TAB_RANKING})}><span>Ranking</span></a>
          </li>
        </ul>
      </div>
    )
  }

  _renderTabApplicants () {
    return (
      this._renderApplicantsList()
    )
  }

  _renderRankingRow (rowData, rowID, sectionID) {

    // find user in applicant list by email
    const email = rowData.person
    const filter = this.props.job.applicants.filter(item => item.emailAddress === email)
    if (filter.length > 0) {
      let matchedUser = filter[0]
      return (
        <div key={`render-ranking-row-${rowID}`}>
          <div className='content'><h1><a href="#">#{rowID}</a></h1></div>
          {this._renderApplicant(matchedUser, rowID, sectionID)}
          <hr />
        </div>
      )
    } else {
      return <div />
    }
  }

  _handleInputChange = (event) => {
    if (event.target) {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }
  
  _renderTabRanking () {
    return (
      <div className='flex flexCol'>
        <div className='field'>
          <p className='control'>
            <label className='radio'>Consultant<input type='radio' value='consult' name='update-ranking-industry' onChange={this._handleInputChange} checked={this.state['update-ranking-industry'] === 'consult'} /></label>
            <label className='radio'>Developer<input type='radio' value='dev' name='update-ranking-industry' onChange={this._handleInputChange} checked={this.state['update-ranking-industry'] === 'dev'} /></label>
            <label className='radio'>In House<input type='radio' value='inhouse' name='update-ranking-industry' onChange={this._handleInputChange} checked={this.state['update-ranking-industry'] === 'inhouse'} /></label>
            <label className='radio'>Project Manager<input type='radio' value='pm' name='update-ranking-industry' onChange={this._handleInputChange} checked={this.state['update-ranking-industry'] === 'pm'} /></label>
          </p>
        </div>
        <button className='button' onClick={() => {this.props.computeRanking(this.props.job.id, this.state['update-ranking-industry'])}}>Update Ranking</button>
        <hr />
        { this.props.jobsState.fetchingRanking &&
          <div style={{alignSelf: 'center', margin: 32}}><Loading color='#26A65B' size='64px' /></div>
        }

        { !this.props.jobsState.fetchingRanking &&
          <ListView
            dataSource={this.props.job.ranking ? this.props.job.ranking : []}
            renderRow={this._renderRankingRow.bind(this)} />
        }
      </div>
    )
  }

  render () {
    if (!this.props.job) {
      return <div>Back</div>
    }

    return (
      <div className='flexColumn'>
        <CardView renderHeader={this._renderTabBar.bind(this)}>
          { this.state.tab === TAB_APPLICANTS &&
            this._renderTabApplicants()
          }

          { this.state.tab === TAB_RANKING &&
            this._renderTabRanking()
          }
          
          { this.state.tab === TAB_EDITJOB &&
            this._renderTabEditJob()

          }

          {/* Pagination */}
          { this.state.tab === TAB_RANKING || this.state.tab === TAB_APPLICANTS &&
            <nav className="pagination">
              <ul className="pagination-list flexCenter">
                <li>
                  <a className="pagination-link is-current">1</a>
                </li>
              </ul>
            </nav>
          }
        </CardView>
      </div>
    )
  }

  _renderTabEditJob () {
    return (
      <div className='flex flexCol'>
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input className='input' type='text' placeholder='Job Title' name='field-title' value={this.state['field-title'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Salary</label>
          <div className='control'>
            <input className='input' type='text' placeholder='Salary' name='field-salary' value={this.state['field-salary'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Description</label>
          <div className='control'>
            <textarea className='textarea' type='text' placeholder='Description' name='field-description' value={this.state['field-description'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Rank required</label>
          <div className='control'>
            <span className='select'>
              <select name='field-rank' onChange={this._handleInputChange}>
                <option value='3' selected={parseInt(this.state['field-rank']) === 3}>S</option>
                <option value='2' selected={parseInt(this.state['field-rank']) === 2}>A</option>
                <option value='1' selected={parseInt(this.state['field-rank']) === 1}>B</option>
                <option value='0' selected={parseInt(this.state['field-rank']) === 0}>C</option>
              </select>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Working location</label>
          <div className='control'>
            <input className='input' type='text' placeholder='Address' name='field-location' value={this.state['field-location'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Eligibility</label>
          <div className='control'>
            <input className='input' type='text' placeholder='4 years experience or above...' name='field-condition' value={this.state['field-condition'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Skills Required</label>
          <div className='control'>
            <input className='input' type='text' placeholder='React.js,Javascript,Swift' name='field-skills' value={this.state['field-skills'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Tags</label>
          <div className='control'>
            <input className='input' type='text' placeholder='Mobile,iOS,Android,Finance,Consultant' name='field-tags' value={this.state['field-tags'] || ''} onChange={this._handleInputChange} />
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            <button className={`button is-primary ${this.state.isLoadingUpdateJob ? 'is-loading' : ''}`} onClick={this.submitJob} disabled={this.state.isLoadingUpdateJob}>Update</button>
          </div>
        </div>

        <hr />
        <div className='field'>
          <div className='control'>
            <button className={`button is-danger`} onClick={this.deleteJob} disabled={this.state.isLoadingUpdateJob}>Delete</button>
          </div>
        </div>
      </div>
    )
  }

  delay = (sec) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {resolve()}, sec)
    })
  }

  submitJob = async () => {
    this.setState({
      isLoadingUpdateJob: true
    })

    await this.delay(1000)

    let job = {
      id: this.props.job.id
    }

    job.title = this.state['field-title']
    job.salary = this.state['field-salary']
    job.description = this.state['field-description']
    job.rankRequired = this.state['field-rank'] && parseInt(this.state['field-rank']) || 0
    job.location = this.state['field-location']
    job.condition = this.state['field-condition']
    job.skills = this.state['field-skills']
    job.tags = this.state['field-tags']

    this.props.createJob(job)

    this.setState({
      isLoadingUpdateJob: false
    })
  }

  deleteJob = () => {
    let job = {
      id: this.props.job.id
    }

    job.delete = true
    this.props.createJob(job)
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
    jobsState: state.jobs,
    job: selectJob(state),
    ranking: state.app.ranking
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    backToList: () => { dispatch(routerActions.replace('/hr')) },
    computeRanking: (id, industry) => { dispatch(JobsActions.computeRanking(id, industry)) },
    updateApplicantRank: (username) => { dispatch(AppActions.updateRankingRequest(username)) },
    createJob: (job) => { dispatch(JobsActions.adminCreateJob(job)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobAdminScreen)

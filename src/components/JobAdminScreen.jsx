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

class JobAdminScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tab: TAB_APPLICANTS,
      'update-ranking-industry': 'consult'
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

          {/* Pagination */}
          <hr />
          <nav className="pagination">
            <ul className="pagination-list flexCenter">
              <li>
                <a className="pagination-link is-current">1</a>
              </li>
            </ul>
          </nav>
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
    jobsState: state.jobs,
    job: selectJob(state),
    ranking: state.app.ranking
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    backToList: () => { dispatch(routerActions.replace('/hr')) },
    computeRanking: (id, industry) => { dispatch(JobsActions.computeRanking(id, industry)) },
    updateApplicantRank: (username) => { dispatch(AppActions.updateRankingRequest(username)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobAdminScreen)

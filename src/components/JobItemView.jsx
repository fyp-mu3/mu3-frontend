// flow

import React from 'react'
import { connect } from 'react-redux'
import { Job } from '../models/Types'
import CardView from './CardView'

export default class JobItemView extends React.Component {
  job = (): Job => {
    return this.props.job
  }

  renderRank = () => {
    const job = this.job()

    return (
      <div className='flex flexApplySpaceMargin'>
        <span className={`tag is-${job.rankRequired === 3 ? 'primary' : 'light'}`}>S</span>
        <span className={`tag is-${job.rankRequired === 2 ? 'primary' : 'light'}`}>A</span>
        <span className={`tag is-${job.rankRequired === 1 ? 'primary' : 'light'}`}>B</span>
        <span className={`tag is-${job.rankRequired === 0 ? 'primary' : 'light'}`}>C</span>
      </div>
    )
  }

  renderTags = (str: string, style, field=true) => {
    if (!str) return null

    return (
      <div className={`flex flexCenterVertical ${field ? 'field' : ''}`} style={{flexWrap: 'wrap'}}>
        {
          str.split(',').map((tag, index) => {
            return <span key={`renderTags-${tag}-${index}`} className={`tag is-${style || primary}`} style={{marginRight: 6, marginBottom: field ? 6 : 0}}>{tag}</span>
          })
        }
      </div>
    )
  }

  renderHeader = () => {
    const job = this.job()
    return (
      <div className='flex flexCenterVertical'>
        <h1>{job.title}</h1>
        <div className='spacer' />
        {this.renderRank()}
      </div>
    )
  }

  getDescription (showAll: boolean) {
    if (!this.props.job.description) return ''

    if (!showAll) {
      if (this.props.job.description.length > 200) {
        return this.props.job.description.substring(0, 200) + ' ...'
      }
    }

    return this.props.job.description
  }

  render () {
    let job = this.job()
    return (
      <CardView className='flex flexCol' renderHeader={this.renderHeader}>
        <div className='columns'>
          <div className='column is-one-third flex flexCol'>
            <figure className='image is-128x128 field'><img src={`${job.company ? job.company.image : null}`} /></figure>
            <h2 className='field' href='#'>{job.company && job.company.name}</h2>
          </div>
          <div className='column flex flexCol'>
            <label className='label'>Job Description</label>
            { !this.props.full &&
              <p className='field'>{this.getDescription(this.props.full || false)}</p>
            }
            {
              this.props.full &&
              <textarea className='textarea field' type='text' value={job.description}>{job.description}</textarea>
            }
            {this.renderTags(job.tags, 'light')}
            <table className='table'>
              <tbody>
                <tr>
                  <th>Salary</th>
                  <td>{job.salary}</td>
                </tr>
                <tr>
                  <th>Skills</th>
                  <td>{this.renderTags(job.skills, 'info', false)}</td>
                </tr>
                <tr>
                  <th>Eligibility</th>
                  <td>{job.condition}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {!this.props.full &&
          <div className='flex flexCol'>
            <hr />
            <div>
              <button 
                data-row={JSON.stringify(job)}
                style={{marginRight: 16}}
                className={job.applied ? 'button is-info' : 'button is-primary'}
                type='button'
                disabled={job.applied}
                onClick={this.props.onApplyJobButtonClick}>{job.applied ? 'Applied' : 'Apply'}</button>
              { (!this.props.full && job.applied) &&
                <button
                  style={{marginRight: 8}}
                  className='button'>Application Processing</button>
              }
            </div>
          </div>
        }
      </CardView>
    )
  }
}
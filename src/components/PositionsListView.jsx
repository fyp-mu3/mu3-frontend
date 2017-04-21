/* @flow */

import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import ListView from './ListView'

import Metrics from '../common/Metrics'
import _ from 'lodash'

import { JobsActions } from '../reducers/JobsRedux'
import { routerActions } from 'react-router-redux'

import { Job } from '../models/Types'

type Props = {
  items: [Job],
}

type DefaultProps = {
  items: []
}

type State = {
  active: number
}

class PositionListView extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
  }

  _onApplyJobButtonClick (event) {
    const rowData = JSON.parse(event.target.getAttribute('data-row'))
    console.info(rowData);
    this.props.viewJobWithId(rowData.id)
  }

  _handleSearchBarChange (event) {
    if (event.target) {
      const value = event.target.value
      this.props.search(value)
    }
  }

  _renderSearchBar () {
    return (
      <div className='control has-addons'>
        <input className='input' type="text" placeholder='Find a position' onChange={this._handleSearchBarChange.bind(this)} />
        <button className='button'>Search</button>
      </div>
    )
  }

  _renderHeader () {
    return (
      <div className='flex flexCenterVertical'>
        {/* left */}
        <div className='flex flexCenterVertical flexApplySpaceMargin'>
          <div>123 positions</div>
          {this._renderSearchBar()}
        </div>
        {/* spacer */}
        <div style={{flexGrow: 1, display: 'block'}} />
        {/* right */}
        <div className='flex flexCenterVertical flexApplySpaceMargin'>
          <div>All</div>
          <div>Related</div>
          <div>Trending</div>
        </div>
      </div>
    )
  }

  _renderRow (rowData: Job, rowID) {
    return (
      <div 
        key={`PositionListView-${rowID}`}
        className='flex flexApplySpaceMargin'
        style={{
          backgroundColor: rowID % 2 == 0 ? '#F5F5F5' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div className='flex'
          style={{width: 80, height: 80, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
          <figure className='image is-64x64'><img src={`${rowData.company ? rowData.company.image : null}`} /></figure>
        </div>
        <div>{rowData.title}</div>
        <div className='spacer'></div>
        <div>
          <button 
            data-row={JSON.stringify(rowData)}
            style={{marginRight: 16}}
            className={rowData.applied ? 'button is-info' : 'button is-primary'}
            type='button'
            disabled={rowData.applied}
            onClick={this._onApplyJobButtonClick.bind(this)}>{rowData.applied ? 'Applied' : 'Apply'}</button>
          { rowData.applied &&
            <button
              style={{marginRight: 8}}
              className='button'>View Application</button>
          }
        </div>
      </div>
    )
  }

  componentWillReceiveProps(newProps) {
    console.info(newProps);
  }

  _prepareDataSource = (): [Job] => {
    if (this.props.jobs.filteredItems && this.props.jobs.filteredItems.length > 0) {
      return this.props.jobs.filteredItems
    }
    
    return this.props.jobs.items
  }

  render () {
    return (
      <CardView
        {...this.props}
        renderHeader={this._renderHeader.bind(this)}>
        <ListView
          dataSource={this._prepareDataSource()}
          renderRow={this._renderRow.bind(this)}
        />
      </CardView>
    )
  }
}

// PositionListView.propTypes = Props
// PositionListView.defaultProps = DefaultProps
const mapStateToProps = (state) => {
  return {
    jobs: state.jobs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewJobWithId: (id) => {
      dispatch(JobsActions.view(id))
      dispatch(routerActions.push(`/jobs/${id}`))
    },
    search: (query) => {
      dispatch(JobsActions.search(query))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionListView)

/* @flow */

import React from 'react'

import CardView from './CardView'
import ListView from './ListView'

import Metrics from '../common/metrics'
import _ from 'lodash'

/** ViewModel */
type PositionItem = {
  title: string
}

type Props = {
  items: Array<PositionItem>,
}

type DefaultProps = {
  items: []
}

type State = {
  active: number
}

class PositionListView extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
  }

  _renderSearchBar () {
    return (
      <div className='control has-addons'>
        <input className='input' type="text" placeholder='Find a position' />
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

  _renderRow (rowData: PositionItem, rowID) {
    return (
      <div 
        key={`PositionListView-${rowID}`}
        className='flex flexApplySpaceMargin'
        style={{
          backgroundColor: rowID % 2 == 0 ? '#F5F5F5' : 'transparent'
        }}>
        <div className='flex'
          style={{width: 80, height: 80, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center'}}>
          <span>media</span>
        </div>
        <div>{rowData.title}</div>
      </div>
    )
  }

  _prepareDataSource (): Array<PositionItem> {
    return _.range(10).map((item) => {
      return {title: `Job Position ${item}`}
    })
  }

  render () {
    return (
      <CardView 
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

export default PositionListView
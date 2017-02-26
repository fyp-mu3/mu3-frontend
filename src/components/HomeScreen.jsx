// @flow

import React from 'react'
import { connect } from 'react-redux'

import PositionListView from './PositionsListView'
import RankingInfoView from './RankingInfoView'

class Home extends React.Component {
  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <RankingInfoView />
        <PositionListView />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}
const mapStateToPros = (state) => {
  return {
  }
}

export default connect(mapStateToPros, mapDispatchToProps)(Home)

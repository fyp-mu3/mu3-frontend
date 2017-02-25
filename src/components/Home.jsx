import React from 'react'
import { connect } from 'react-redux'

import PositionListView from './PositionsListView'

class Home extends React.Component {

  render () {
    const user = this.props.passport || {}

    return (
      <div>
        <h1>Home</h1>
        <PositionListView />
      </div>
    )
  }
}

const mapStateToPros = (state) => {
  return {
    passport: state.session
  }
}

export default connect(mapStateToPros, null)(Home)

import React from 'react'

import Metrics from '../common/metrics'

export default class CardView extends React.PureComponent {

  _renderSeperator () {
    return <div style={seperatorStyle} />
  }

  _renderHeader () {
    if (this.props.renderHeader) {
      return (
        <div>
          {this.props.renderHeader()}
          {this._renderSeperator()}
        </div>
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <div style={containerStyle}>
        {this._renderHeader()}
        {this.props.children}
      </div>
    )
  }
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  padding: Metrics.baseMargin,
  background: 'white',
  border: '1px solid #E6E9ED'
}

const seperatorStyle = {
  marginTop: Metrics.baseMargin,
  marginBottom: Metrics.baseMargin,
  backgroundColor: '#eee',
  height: 1
}

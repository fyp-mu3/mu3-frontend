import React from 'react'

import Metrics from '../common/Metrics'
import { merge } from 'lodash'

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
    } else if (this.props.title) {
      return (
        <div>
          <h1>{this.props.title}</h1>
          {this._renderSeperator()}
        </div>
      )
    } else {
      return <div />
    }
  }

  render () {
    let _style = containerStyle
    if (this.props.style) {
      _style = merge(containerStyle, this.props.style)
    }

    return (
      <div
        style={_style}>
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
  border: '1px solid #E6E9ED',
  marginBottom: Metrics.baseMargin
}

const seperatorStyle = {
  marginTop: Metrics.baseMargin,
  marginBottom: Metrics.baseMargin,
  backgroundColor: '#eee',
  height: 1
}

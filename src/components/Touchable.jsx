import React from 'react'
import { merge } from 'lodash'

export default class Touchable extends React.PureComponent {

  constructor (props) {
    super(props)

    this.state = { hover: false }
  }

  _onMouseEnter () {
    this.setState({ hover: true })
  }

  _onMouseLeave () {
    this.setState({ hover: false })
  }

  render () {
    let _style = merge(touchableStyle, this.props.style)

    if (this.state.hover) {
      _style = {..._style, background: '#f5f5f5'}
    }
    
    let highlight = <div style={{position: 'absolute', background: '#f5f5f5', top: 0, left: 0, right: 0, bottom: 0}} />

    return (
      <div style={_style} onMouseEnter={this._onMouseEnter.bind(this)} onMouseLeave={this._onMouseLeave.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}

const touchableStyle = {
  position: 'relative'
}

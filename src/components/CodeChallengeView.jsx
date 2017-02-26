import React from 'react'

import CardView from './CardView'

import type { CodeChallenge } from '../models/CodeChallenge'

type State = {
  started: boolean,
  challenge: CodeChallenge
}

class CodeChallengeView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      started: false,
      challenge: null
    }
  }

  _renderChallengeStats () {
    return (
      <CardView>
        <div>問題集計</div>
      </CardView>
    )
  }

  _renderChallengeDetail () {
    return (
      <CardView>
        <button className='button is-primary' onClick={() => this.setState({started: true})}>Start</button>
      </CardView>
    )
  }

  _renderReady () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {this._renderChallengeStats()}
        {this._renderChallengeDetail()}
      </div>
    )
  }

  render () {
    if (!this.state.started) { return this._renderReady() }

    return <div>started</div>
  }
}

export default CodeChallengeView

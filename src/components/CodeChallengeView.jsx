import React from 'react'

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

  _renderReady () {
    return (
      <div>Ready</div>
    )
  }

  render () {
    if (!this.state.started) { return this._renderReady() }
  }
}

export default CodeChallengeView
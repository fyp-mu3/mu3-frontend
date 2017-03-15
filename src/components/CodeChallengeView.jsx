// @flow
import React from 'react'

import CardView from './CardView'
import CodeHelper from '../common/CodeHelper'
import Loading from 'halogen/PulseLoader'

import type { CodeChallenge } from '../models/Types'

import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/ruby'
import 'brace/theme/solarized_dark'

type State = {
  started: boolean,
  challenge: CodeChallenge
}

class CodeChallengeView extends React.Component {
  _editorValue: string = ''

  constructor (props) {
    super(props)

    this.state = {
      started: false,
      challenge: null,
      loadingSubmission: false,
      codeResult: null
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

  _renderCodeResultPanel () {
    if (this.state.loadingSubmission) {
      return (
        <div className='flex flexCenter'>
          <Loading color="#26A65B" size="8px" margin="4px"/>
        </div>
      )
    }

    if (this.state.codeResult) {
      return (
        <div>
          {JSON.stringify(this.state.codeResult)}
        </div>
      )
    }
  }

  render () {
    if (!this.state.started) { return this._renderReady() }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <AceEditor
          ref='editor'
          mode='ruby'
          theme='solarized_dark'
          name='ace-editor'
          value={this._editorValue}
          style={{
            width: '100%'
          }}
          onChange={this._onEditorChange}
        />
        <div className='flex flexApplySpaceMargin' style={{marginTop: 16}}>
          <div style={{flexGrow: 1}} />
          <span><button className='button'>Run</button></span>
          <span><button className='button is-primary' onClick={this._handleSubmitCode}>Submit</button></span>
        </div>

        {this._renderCodeResultPanel()}
      </div>
    )
  }

  _onEditorChange = (newValue) => {
    this._editorValue = newValue
  }

  _handleSubmitCode = () => {
    this.setState({loadingSubmission: true})

    CodeHelper.run({
      lang: 'ruby',
      source: this._editorValue
    })
    .then((codeResult) => {
      let mappedContent = CodeHelper.mapResult(codeResult)
      this.setState({
        codeResult: mappedContent,
        loadingSubmission: false
      })
    })
  }
}

export default CodeChallengeView

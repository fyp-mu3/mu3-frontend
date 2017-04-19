// @flow
import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import CodeHelper from '../common/CodeHelper'
import Loading from 'halogen/PulseLoader'

import type { CodeChallenge } from '../models/Types'

import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/ruby'
import 'brace/theme/solarized_dark'

import ReactDOM from 'react-dom'
import ReactMarkDown from 'react-markdown'

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
      loadingSubmission: false,
      codeResult: null
    }
  }

  _renderChallengeHeader () {
    return (
      <h1>{this.props.challenge.title}</h1>
    )
  }

  _renderChallengeStats () {
    return (
      <CardView>
        <div>Challenge Statistics</div>
      </CardView>
    )
  }

  _renderChallengeDetail () {
    return (
      <CardView
        renderHeader={this._renderChallengeHeader.bind(this)}>
        <div className='content'><ReactMarkDown source={this.props.challenge.content} /></div>
        { !this.state.started && <button className='button is-primary' onClick={() => this.setState({started: true})}>Start</button> }
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

  _renderCodeResultPanelHeader () {
    return (
      <h3>Result</h3>
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
      console.info(this.state.codeResult);
      return (
        <CardView
          style={{marginTop: 16}}
          renderHeader={this._renderCodeResultPanelHeader.bind(this)}
        >
          <div style={{'white-space': 'pre-wrap'}}>
            {this.state.codeResult.stdout[0]}
          </div>
        </CardView>
      )
    }
  }

  render () {
    if (!this.props.challenge) { return <div /> }

    if (!this.state.started) { return this._renderReady() }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        { this._renderChallengeDetail() }
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

const mapStateToProps = (state) => {
  return {
    challenge: state.codeChallenges.currentChallengeId ? state.codeChallenges.items.find(item => item.id === state.codeChallenges.currentChallengeId) : null
  }
}

export default connect(mapStateToProps, null)(CodeChallengeView)

// @flow
import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import CodeHelper from '../common/CodeHelper'
import Loading from 'halogen/PulseLoader'
import SmallLoading from 'halogen/MoonLoader'

import type { CodeChallenge } from '../models/Types'
import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'

import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/ruby'
import 'brace/mode/javascript'
import 'brace/mode/c_cpp'
import 'brace/mode/java'

import 'brace/theme/solarized_dark'

import ReactDOM from 'react-dom'
import ReactMarkDown from 'react-markdown'

import SweetAlert from 'sweetalert-react'

const languageOptions = [
  'ruby',
  'python3',
  'c',
  'java'
]

type State = {
  started: boolean,
  challenge: CodeChallenge
}

class CodeChallengeView extends React.Component {
  constructor (props) {
    super(props)

    this.timerInstance = null

    this.state = {
      started: false,
      loadingSubmission: false,
      codeResult: null,
      showAlert: false,
      timer: 900,
      lang: languageOptions[0],
      editorValue: props.challenge && props.challenge.template ? props.challenge.template[languageOptions[0]] : '',
      showSubmissionAlert: false,
      submission: false,
      testcases: props.challenge ? props.challenge.testcases.map((item, index) => { return {item: item, status: false} }) : []
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.timer === 0 && prevState.timer !== 0) {
      // times up
      this.setState({ started: false })
    }

    if (this.props.challenge) {
      this.props.startChallenge(this.props.challenge.id, this._isAC())
    }
  }

  componentWillUnmount () {
    if (this.timerInstance) {
      clearInterval(this.timerInstance)
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
        { !this.state.started && <button className='button is-primary' onClick={() => this.setState({started: true, showAlert: true})}>Solve Challenge</button> }
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

  _normaliseStderr (stderr) {
    if (stderr) {
    }

    return null
  }

  _normaliseStdout (stdout) {
    if (stdout) {
      if (Array.isArray(stdout) && stdout.length > 0) {
        return stdout[0]
      }
    }

    return ''
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
        <CardView
          style={{marginTop: 16}}
          renderHeader={this._renderCodeResultPanelHeader.bind(this)}
        >
          { this.state.codeResult.compileMessage && 
            <article className='message'>
              <div className='message-header'><p>Compile Message</p></div>
              <div className='message-body'>
                {this.state.codeResult.compileMessage}
              </div>
            </article>
          }

          { this.state.codeResult.stderr && 
            <article className='message is-danger'>
              <div className='message-header'><p>stderr</p></div>
              <div className='message-body'>
                {this.state.codeResult.stdout && this.state.codeResult.stderr[0]}
              </div>
            </article>
          }
          { this.state.codeResult.stdout && 
            <div style={{'white-space': 'pre-wrap'}}>
              <article className='message is-info'>
                <div className='message-header'><p>stdout</p></div>
                <div className='message-body'>
                  {this.state.codeResult.stdout && this._normaliseStdout(this.state.codeResult.stdout)}
                </div>
              </article>
            </div>
          }
        </CardView>
      )
    }
  }

  _renderStartAlert () {
    return (
      <SweetAlert 
        show={this.state.showAlert}
        title='Press ok to start the timer'
        text='You have 30mins to solve the challenge'
        onConfirm={() => {
          this.setState({showAlert: false})
          this.timerInstance = setInterval(() => {
            this.setState({timer: this.state.timer - 1})
          }, 1000)
        }}
      />
    )
  }

  _renderSubmissionAlert () {
    return (
      <SweetAlert
        show={this.state.showSubmissionAlert}
        title='Submission'
        text='Confirm Submission ?'
        onConfirm={() => {
          
        }}
      />
    )
  }

  _renderAceEditor () {
    return (
      <AceEditor
        ref='editor'
        mode={this.state.lang}
        theme='solarized_dark'
        name='ace-editor'
        value={this.state.editorValue}
        style={{
          width: '100%'
        }}
        onChange={this._onEditorChange}
      />
    )
  }

  _renderTimer () {
    return (
      <CardView>
        <h1 className='title'>Time Remains</h1>
        <h2 className='subtitle'>{this.state.timer} seconds</h2>
      </CardView>
    )
  }

  _renderLangPicker () {
    return (
      <form>
        <div className='field'>
          <p className='control'>
            <span className='select is-small'>
              <select onChange={this._handleLangOptionsChange.bind(this)} value={this.state.lang}>
                {
                  languageOptions.map((item, index) => {
                    return <option key={`lang-options-${index}`} value={item}>{item}</option>
                  })
                }
              </select>
            </span>
          </p>
        </div>
      </form>
    )
  }

  _handleLangOptionsChange (event) {
    this.setState({
      lang: event.target.value,
      editorValue: this.props.challenge.template[event.target.value]
    })
  }

  render () {
    if (!this.props.challenge) { return <div /> }
    
    if (!this.state.started) { return this._renderReady() }

    if (this.state.submission) { return this._renderSubmission() }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        { this._renderChallengeDetail() }
        { this._renderTimer() }
        { this._renderLangPicker() }
        { this._renderAceEditor() }
        <div className='flex flexApplySpaceMargin' style={{marginTop: 16}}>
          <div style={{flexGrow: 1}} />
          <span><button className='button' onClick={this._handleRunCode}>Run</button></span>
          <span><button className='button is-primary' onClick={this._handleSubmitCode}>Submit</button></span>
        </div>

        {this._renderCodeResultPanel()}
        {this._renderStartAlert()}
      </div>
    )
  }

  _onEditorChange = (newValue) => {
    // this.state.editorValue = newValue
    this.setState({
      editorValue: newValue
    })
  }

  _handleSubmitCode = () => {

    let confirmSubmission = confirm('Confirm Submission ?')

    if (confirmSubmission) {
      this.setState({submission: true})
      this._handleRunCode()      
    }
  }

  _handleRunCode = () => {
    this.setState({loadingSubmission: true})

    CodeHelper.run({
      lang: this.state.lang,
      source: this.state.editorValue,
      testcases: this.props.challenge.testcases
    })
    .then((codeResult) => {
      let mappedContent = CodeHelper.mapResult(codeResult)

      const _testcases = this.state.testcases.map((testcase, index) => {
        console.info(this.props.challenge);
        if (this.props.challenge.expect[index] === mappedContent.stdout[index]) {
          testcase.status = true
        }

        return testcase
      })

      this.setState({
        codeResult: mappedContent,
        loadingSubmission: false,
        testcases: _testcases
      })
    })
  }

  _testCaseStatusToIcon (testcase) {
    return testcase.status ? 'fa fa-check' : 'fa fa-times'
  }

  _isAC () {
    return this.state.testcases.filter((item) => item.status === false).length === 0
  }

  _renderSubmission () {
    return (
      <div className="flex flexCol">
        {
          this.state.loadingSubmission &&
            <div className='flex flexCenter'>
              <Loading color="#26A65B" size="8px" margin="4px"/>
            </div>
        }

        { !this.state.loadingSubmission &&
          this._renderCodeResultPanel()
        }
        <CardView>
          {
            this.state.testcases.map((test, index) => {
              return (
                <div className='flex flexCenterVertical'>
                  { this.state.loadingSubmission && <SmallLoading color='darkgrey' size='21px' />}
                  { !this.state.loadingSubmission && <span className='icon'><i className={this._testCaseStatusToIcon(this.state.testcases[index])} /></span>}
                  <div style={{marginLeft: 8}} key={`testcases-${index}`}>Test Case #{index}</div>
                </div>
              )
            })
          }
        </CardView>

        { !this.state.loadingSubmission && this._isAC() ? 
          <button className='button is-success'>Success</button> : 
          <button className='button is-info' onClick={() => this.setState({submission: false})}>Retry</button> }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    challenge: state.codeChallenges.currentChallengeId ? state.codeChallenges.items.find(item => item.id === state.codeChallenges.currentChallengeId) : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startChallenge: (id, result) => dispatch(CodeChallengeActions.start(id, result))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeChallengeView)

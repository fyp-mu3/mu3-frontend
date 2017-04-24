// @flow

import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import ListView from './ListView'
import Touchable from './Touchable'
import CodeChallengeListItemView from './CodeChallengeListItemView'

import Metrics from '../common/Metrics'

import { Link } from 'react-router'

import type { CodeChallenge } from '../models/Types'

import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'

class CodeChallengesScreen extends React.PureComponent {
  _renderDescription () {
    return (
      <CardView>
        Solve the code challenges in limited time.
      </CardView>
    )
  }

  _renderSummary () {
    return (
      // <CardView style={{marginTop: Metrics.baseMargin}}>
      //   <div>Roy Tang Chun Yipさんの獲得トロフィー</div>
      //   <div>合計獲得トロフィー： 2個</div>
      // </CardView>
      <div />
    )
  }

  _prepareDataSource () {
    return this.props.codeChallenges.items
  }

  _renderSectionTitle () {
    return <h1>Code Challenges</h1>
  }

  _renderRow (rowData: CodeChallenge, rowID, sectionID) {
    /*<Touchable key={`codeChallenges-${rowID}`}>
      <Link to={`/codeChallenges/${rowData.id}`} onMouseUp={() => this.props.loadCodeChallenge(rowData.id)}>
        {JSON.stringify(rowData)}>
      </Link>
    </Touchable>*/
    return (
      <CodeChallengeListItemView item={rowData} loadItemAction={this.props.loadCodeChallenge} />
    )
  }

  _renderChallengesList () {
    return (
      <CardView renderHeader={this._renderSectionTitle.bind(this)}>
        <ListView
          dataSource={this._prepareDataSource()}
          renderRow={this._renderRow.bind(this)}
        />
      </CardView>
    )
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {this._renderDescription()}
        {this._renderSummary()}
        {this._renderChallengesList()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    codeChallenges: state.codeChallenges
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCodeChallenge: (id: string) => dispatch(CodeChallengeActions.loadChallenge(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeChallengesScreen)

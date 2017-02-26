// @flow

import React from 'react'
import { connect } from 'react-redux'

import CardView from './CardView'
import ListView from './ListView'
import Touchable from './Touchable'

import Metrics from '../common/metrics'

import { Link } from 'react-router'

import type { CodeChallenge } from '../models/CodeChallenge'

class CodeChallengesScreen extends React.PureComponent {
  _renderDescription () {
    return (
      <p>
        問題には制限時間があり、 一度のみのチャレンジとなります。制限時間内に出題された問題の解答コードを提出してください。 問題は約1週間ごとに追加されます。 一度獲得したpaizaランクは下がる事はありません。スキルチェックは問題・取得ランクともpaiza全サービスで共通です。
        問題採点結果が合格点以上の場合、 トロフィー トロフィーが付与されます。
      </p>
    )
  }

  _renderSummary () {
    return (
      <CardView style={{marginTop: Metrics.baseMargin}}>
        <div>Roy Tang Chun Yipさんの獲得トロフィー</div>
        <div>合計獲得トロフィー： 2個</div>
      </CardView>
    )
  }

  _prepareDataSource () {
    return this.props.codeChallenges.items
  }

  _renderSectionTitle () {
    return <h1>Code Challenges</h1>
  }

  _renderRow (rowData: CodeChallenge, rowID, sectionID) {
    return (
      <Touchable key={`codeChallenges-${rowID}`}>
        <Link to={`/codeChallenges/${rowData.id}`}>{JSON.stringify(rowData)}></Link>
      </Touchable>
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

export default connect(mapStateToProps, null)(CodeChallengesScreen)

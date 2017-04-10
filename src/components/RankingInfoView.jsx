import React from 'react'
import { connect } from 'react-redux'

import Metrics from '../common/Metrics'

import CardView from './CardView'
import ListView from './ListView'
import Touchable from './Touchable'
import CodeChallengeListItemView from './CodeChallengeListItemView'

import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'

class RankingInfoView extends React.PureComponent {

  _getUser () {
    let session = this.props.session

    if (!session.passport || !session.passport.user) { return null }

    return session.passport.user
  }

  _renderLoginBox () {
    return <div />
  }

  _renderLeftHeader () {
    return <div>mu-3 ランク</div>
  }

  _renderRightHeader () {
    return <div>Latest Code Challenges</div>
  }

  /** ListView delegate: Latest Challenges */
  _prepareDataSource () {
    return this.props.codeChallenges.items
  }

  _renderRow (rowData, rowID, sectionID) {
    return (
      <CodeChallengeListItemView key={`latest-challenges-${rowID}`} item={rowData} loadItemAction={this.props.loadCodeChallenge} />
    )
  }
  /** end ListView delegate */

  render () {
    let _user = this._getUser()

    if (!_user) { return this._renderLoginBox() }

    return (
      <div className='flex flexApplySpaceMargin'>
        <CardView style={{flex: 1}} renderHeader={this._renderLeftHeader.bind(this)}>
          <div>{_user.profile.displayName}さんのmu-3ランク</div>
        </CardView>
        <CardView style={{flex: 1}} renderHeader={this._renderRightHeader.bind(this)}>
          <ListView
            dataSource={this._prepareDataSource()}
            renderRow={this._renderRow.bind(this)} />
        </CardView>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    codeChallenges: state.codeChallenges
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCodeChallenge: (id: string) => dispatch(CodeChallengeActions.loadChallenge(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingInfoView)

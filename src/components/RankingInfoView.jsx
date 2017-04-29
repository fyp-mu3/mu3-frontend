import React from 'react'
import { connect } from 'react-redux'

import Metrics from '../common/Metrics'

import CardView from './CardView'
import ListView from './ListView'
import Touchable from './Touchable'
import CodeChallengeListItemView from './CodeChallengeListItemView'

import { CodeChallengeActions } from '../reducers/CodeChallengesRedux'

import { nth } from 'lodash/nth'

import RankLetter from './RankLetter'

class RankingInfoView extends React.PureComponent {

  _getUser () {
    let session = this.props.session

    if (!session.passport || !session.passport.user) { return null }

    return session.passport.user
  }

  _getRanking () {
    if (this.props.currentUser) {
      return this.props.ranking ? this.props.ranking[this.props.currentUser.emailAddress] : null
    }

    return null
  }

  _renderLoginBox () {
    return <div />
  }

  _renderLeftHeader () {
    return (
      <div className='flex flexCenterVertical flexApplySpaceMargin'>
        <span className="icon is-medium">
          <i className="fa fa-trophy"></i>
        </span>
        <h1>You Status</h1>
      </div>
    )
  }

  _renderRightHeader () {
    return <div>Latest Code Challenges</div>
  }

  /** ListView delegate: Latest Challenges */
  _prepareDataSource () {
    if (this.props.codeChallenges.items.length > 0) {
      let unsolved = this.props.codeChallenges.items.filter(item => item.session && !item.session.result)
      if (unsolved.length > 0) {
        return [unsolved[0]]
      }
      return [this.props.codeChallenges.items[0]]
    } else {
      return []
    }
  }

  _renderRow (rowData, rowID, sectionID) {
    return (
      <CodeChallengeListItemView key={`latest-challenges-${rowID}`} item={rowData} loadItemAction={this.props.loadCodeChallenge} />
    )
  }
  /** end ListView delegate */

  _renderRankingInfo () {
    const ranking = this._getRanking()
    const user = this.props.currentUser
    if (!ranking) return <div />
    if (!user) return <div />

    let solvedChallengeCount = ranking.numSolvedChallenges || 0

    return (
      <div className='flex flexCenterVertical'>
        <div className='flex flexCol' style={{alignItems: 'stretch'}}>
          <span>{`${user.firstName} ${user.lastName}'s ranking`}</span>
          <table className='table'><tbody>
            <tr className='is-selected'>
              <td>Ranking</td><td><RankLetter char={ranking.rank} size='image is-16x16' /></td>
            </tr>
            <tr>
              <td>Solved Challenges</td><td>{solvedChallengeCount}</td>
            </tr>
          </tbody></table>
          <div className='notification is-primary'>
            <button className="delete" disabled></button>
            Improve your ranking to unlock more jobs
          </div>
        </div>
      </div>
    )
  }

  render () {
    let _user = this._getUser()

    if (!_user) { return this._renderLoginBox() }

    return (
      <div className='flex flexApplySpaceMargin'>
        <CardView style={{flex: 1}} renderHeader={this._renderLeftHeader.bind(this)}>
          {this._renderRankingInfo()}
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
    currentUser: state.app.user,
    session: state.session,
    codeChallenges: state.codeChallenges,
    ranking: state.app.ranking
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCodeChallenge: (id: string) => dispatch(CodeChallengeActions.loadChallenge(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingInfoView)

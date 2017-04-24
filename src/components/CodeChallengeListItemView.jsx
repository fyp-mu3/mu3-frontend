// @flow

import React from 'react'
import { Link } from 'react-router'
import { CodeChallenge } from '../models/Types'

import CardView from './CardView'
import RankLetter from './RankLetter'

type PropsType = {
  item: CodeChallenge
}


export default class CodeChallegeListItemView extends React.Component<PropsType, {}> {
  constructor(props: PropsType) {
    super(props)
  }

  _onChallengeButtonClick = () => {
    this.props.loadItemAction(this.props.item.id)
  }

  _renderHeader = () => {
    let _item: CodeChallenge = this.props.item
    return (
      <div className='flex flexCenterVertical flexApplySpaceMargin'>
        <h1>{_item.title}</h1>
      </div>
    )
  }

  _renderActionButton = () => {
    if (this.props.item.session && this.props.item.session.result) {
      return (
        <button disabled className='button is-info'>Solved</button>
      )
    } else {
      return (
        <Link 
          to={`/codeChallenges/${this.props.item.id}`}
          className='button is-primary'
          onMouseUp={this._onChallengeButtonClick}>
          Challenge
        </Link>
      )
    }
  }

  render () {
    let _item: CodeChallenge = this.props.item

    if (!_item) { return <div /> }
    
    return (
      <CardView
        renderHeader={this._renderHeader}
      >
        <div className='content'>{_item.description ? _item.description : _item.content}</div>
        <div className='flex' style={{alignItems: 'center'}}>
          <div className='rankText'><RankLetter size='image is-24x24' char={_item.rank} /></div>
          <div className='spacer' />
          {this._renderActionButton()}
        </div>
      </CardView>
    )
  }
}

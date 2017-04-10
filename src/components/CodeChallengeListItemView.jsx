// @flow

import React from 'react'
import { Link } from 'react-router'
import { CodeChallenge } from '../models/Types'

import CardView from './CardView'

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

  render () {
    let _item: CodeChallenge = this.props.item

    if (!_item) { return <div /> }
    
    return (
      <CardView
        renderHeader={this._renderHeader}
      >
        <div className='content'>{_item.content ? _item.content.substring(0, 100) + ' ...' : ''}</div>
        <div className='flex' style={{alignItems: 'center'}}>
          <div className='rankText'>{_item.rank}</div>
          <div className='spacer' />
          <Link 
            to={`/codeChallenges/${_item.id}`}
            className='button is-primary'
            onMouseUp={this._onChallengeButtonClick}>
            Challenge
          </Link>
        </div>
      </CardView>
    )
  }
}

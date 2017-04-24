import React from 'react'

const IMG_S = '/images/rank_S.png'
const IMG_A = '/images/rank_A.png'
const IMG_B = '/images/rank_B.png'
const IMG_C = '/images/rank_C.png'

export default class RankLetter extends React.Component {
  mapCharToImage () {
    if (this.props.char === 's' || this.props.char === 3) {
      return IMG_S
    }

    if (this.props.char === 'a' || this.props.char === 2) {
      return IMG_A
    }

    if (this.props.char === 'b' || this.props.char === 1) {
      return IMG_B
    }

    if (this.props.char === 'c' || this.props.char === 0) {
      return IMG_C
    }

    return IMG_C
  }

  render () {
    return (
      <figure className={this.props.size || 'image is-48x48'}>
        <img src={this.mapCharToImage()} />
      </figure>
    )
  }
}

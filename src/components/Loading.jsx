import React from 'react'
import LoadingView from 'halogen/PulseLoader'

export default class Loading extends React.PureComponent {
  render () {
    return <LoadingView style={{
      alignSelf: 'center'
    }} color='#26A65B' size='8px' margin='4px' />
  }
}

import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import Metrics from '../common/metrics'

class NavigationTop extends React.Component {

  _renderNameBadge () {
    if (!this.props.currentUser) { return null }

    return (
      <a className='flex flexCenterVertical'>
        {this.props.currentUser.profile.displayName}
        <span className='icon is-small'>
          <i className='fa fa-angle-down' aria-hidden='true' />
        </span>
      </a>
    )
  }

  _renderBarMenuButton () {
    return (
      <span className='icon is-medium'>
        <i className='fa fa-bars' aria-hidden='true' />
      </span>
    )
  }

  render () {
    return (
      <nav className='nav' style={{height: 60, backgroundColor: '#EDEDED', borderBottom: '1px solid #D9DEE4'}}>
        <div className='nav-left' style={{paddingLeft: Metrics.baseMargin}}>
          <div className='flex flexCenterVertical'>
            {this._renderBarMenuButton()}
          </div>
        </div>
        <div className='nav-right' style={{paddingRight: Metrics.baseMargin}}>
          <div className='flex flexCenterVertical'>
            {this._renderNameBadge()}
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.passport ? state.session.passport.user : null
  }
}

export default connect(mapStateToProps, null)(NavigationTop)

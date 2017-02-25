import React from 'react'
import { connect } from 'react-redux'
import Metrics from '../common/metrics'
import { Link } from 'react-router'

class NavigationMenu extends React.Component {

  constructor (props) {
    super(props)

    this.state = {

    }
  }

  _renderRow (rowData, rowID) {
    let icon = null

    if (rowData.iconType && rowData.iconType === 'fa') {
      icon = <span className='icon' style={{marginRight: 8}}><i className='fa fa-home' aria-hidden='true' /></span>
    }

    return (
      <div key={`navigation-menu-${rowID}-${rowData.key}`}>
        <Link to={rowData.url} style={{
          paddingTop: 13,
          paddingRight: 15,
          paddingBottom: 12,
          paddingLeft: 15,
          color: '#ecf0f1',
          fontWeight: 'bold'
        }} className='flex flexCenterVertical'>
          { icon }
          <span style={{flexGrow: 1}}>{rowData.title}</span>
          <span className='icon is-small'><i className='fa fa-angle-down' aria-hidden='true' /></span>
        </Link>
      </div>
    )
  }

  _renderSectionTitle (sectionTitle) {
    return (
      <div style={{
        display: 'flex',
        paddingTop: 13,
        paddingRight: Metrics.baseMargin,
        paddingBottom: 0,
        paddingLeft: Metrics.baseMargin,
        flexDirection: 'row',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
      }}>
        {sectionTitle}
      </div>
    )
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {this._renderSectionTitle(this.props.sectionTitle)}
        {
          this.props.dataSource().map((item, index) => {
            return this._renderRow(item, index)
          })
        }
      </div>
    )
  }
}

class NavigationLeft extends React.Component {

  _prepareDataSource () {
    return [
      {
        key: 'home',
        title: 'Home',
        url: '/home',
        iconType: 'fa',
        iconUri: 'fa fa-home'
      },
      {
        key: 'Forms',
        title: 'Forms',
        url: '/forms'
      },
      {
        key: 'Notfound',
        title: 'Notfound',
        url: '/notfound'
      }
    ]
  }

  _renderLogo () {
    return (
      <div style={{
        padding: Metrics.baseMargin,
        color: 'white',
        fontSize: 25,
        fontWeight: 'normal'
      }} className='flex flexCenterVertical flexApplySpaceMargin'>
        <span className='icon is-medium'><i className='fa fa-eercast' aria-hidden='true' /></span>
        <span>Project MU3</span>
      </div>
    )
  }

  render () {
    return (
      <div
        className='is-hidden-mobile'
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#2A3F54',
          width: 230,
          minWidth: 230
        }}>
        {this._renderLogo()}
        <NavigationMenu
          sectionTitle={'GENERAL'}
          dataSource={this._prepareDataSource.bind(this)}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.passport ? state.session.passport.user : null
  }
}

export default connect(mapStateToProps, null)(NavigationLeft)

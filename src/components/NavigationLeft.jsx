import React from 'react'
import { connect } from 'react-redux'
import Metrics from '../common/metrics'
import { Link } from 'react-router'

class NavigationMenu extends React.Component {
  _renderRow (rowData, rowID) {
    return (
      <div key={`navigation-menu-${rowID}-${rowData.key}`}>
        <Link to={rowData.url} style={{
          display: 'flex',
          paddingTop: 13,
          paddingRight: 15,
          paddingBottom: 12,
          paddingLeft: 15,
          flexDirection: 'row'
        }}>
          <span style={{flexGrow: 1}}>{rowData.title}</span>
          <span style={{}}>v</span>
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
        flexDirection: 'row'
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
        url: '/home'
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
        padding: Metrics.baseMargin
      }}>
        Project MU3
      </div>
    )
  }

  render () {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2A3F54',
        width: 230
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

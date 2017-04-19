import React from 'react'
import { connect } from 'react-redux'

import ListView from './ListView'
import CardView from './CardView'

import { CompanyActions } from '../reducers/CompanyRedux'

class HRScreen extends React.Component {
  _renderRowHeader (company) {
    return (
      <div className='flex flexCenterVertical flexApplySpaceMargin'>
        <div className='image is-48x48'><img src={company.image} /></div>
        <h1>{company.name}</h1>
        <div className='spacer' />
        <button type='button' className='button is-primary' onClick={() => {this.props.companyAdminView(company.id)}}>Manage</button>
      </div>
    )
  }

  _renderRow (data, rowID, sectionID) {
    return (
      <CardView
        key={`companyScreenViewList-${rowID}-${sectionID}`}
        renderHeader={this._renderRowHeader.bind(this, data)}
      >
        <div className='flex flexApplySpaceMargin'>
          {
            data.industry.map((item, index) => {
              return <span key={`company-i-tag-${index}-${rowID}`} className='tag is-light'>{item}</span>
            })
          }
        </div>
      </CardView>
    )
  }

  render () {
    return (
      <ListView
        renderRow={this._renderRow.bind(this)}
        dataSource={this.props.companies.items}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    companies: state.companies
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch: () => {dispatch(CompanyActions.fetchRequest())},
    companyAdminView: (id: string) => { dispatch(CompanyActions.adminViewRequest(id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HRScreen)

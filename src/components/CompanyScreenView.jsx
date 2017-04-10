import React from 'react'
import { connect } from 'react-redux'

import ListView from './ListView'
import CardView from './CardView'

class CompanyScreenView extends React.Component {
  _renderRowHeader (company) {
    return (
      <div className='flex'>
        <h1>{company.name}</h1>
        <div className='spacer' />
        <button type='button' className='button is-primary'>Manage</button>
      </div>
    )
  }

  _renderRow (data, rowID, sectionID) {
    return (
      <CardView
        key={`companyScreenViewList-{rowID}-{sectionID}`}
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

export default connect(mapStateToProps)(CompanyScreenView)

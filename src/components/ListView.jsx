// @flow

import React from 'react'

type Props = {
  renderRow: (rowData: any, rowID: number, sectionID: number) => any,
  dataSource: Array<any>,
}

const DefaultProps = {
  renderRow: null,
  dataSource: []
}

class ListView extends React.PureComponent<Props, {}> {
  constructor (props: Props) {
    super(props)
  }

  _renderRow (rowData: any, rowID: number, sectionID: number) {
    return this.props.renderRow(rowData, rowID, sectionID)
  }

  render () {
    return (
      <div style={listViewStyle}>
        {
          this.props.dataSource.map((item, index) => {
            return this._renderRow(item, index, 0)
          })
        }
      </div>
    )
  }
}

const listViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch'
}

// ListView.propTypes = Props
ListView.defaultProps = DefaultProps

export default ListView

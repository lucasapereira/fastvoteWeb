import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

const EmptyRowsView = () => <div>Não foi encontrado nenhum registro.</div>;

class SimpleGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { rows: props.rows, selectedIndexes: [] };
  }

  rowGetter = i => {
    return this.state.rows[i];
  };

  onRowsSelected = rows => {
    let selItem = this.state.selectedIndexes.concat(rows.map(r => r.rowIdx));
    this.setState({
      selectedIndexes: selItem,
    });
    this.props.setSelectedIndexes(selItem);
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    let selItem = this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1);

    this.setState({
      selectedIndexes: selItem,
    });
    this.props.setSelectedIndexes(selItem);
  };

  render() {
    const rowText = this.state.selectedIndexes.length === 1 ? 'row' : 'rows';

    return (
      <div>
        <span>
          {this.state.selectedIndexes.length} {rowText} selected
        </span>
        <ReactDataGrid
          rowKey={this.props.rowKey}
          columns={this.props.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
          emptyRowsView={EmptyRowsView}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes,
            },
          }}
        />
      </div>
    );
  }
}

export default SimpleGrid;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ReactDataGrid from 'react-data-grid';
import { confirmable } from 'react-confirm';
import ReactPaginate from 'react-paginate';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import update from 'react-addons-update';
import confirm from './confirm';
import MyLoader from './myLoader';

const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');

const EmptyRowsView = () => <div>Não foi encontrado nenhum registro.</div>;

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: props.rows,
      filters: {},
      selectedIndexes: [],
      loading: false,
      pageSelected: 0,
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.rows) {
      this.setState({
        loading: false,
        rows: nextProps.rows,
        filters: {},
        selectedIndexes: [],
      });
    }
  };

  onClearFilters = () => {
    // all filters removed
    this.setState({
      filters: {},
    });
  };

  onRowsSelected = rows => {
    this.setState({
      selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)),
    });
  };

  onRowsDeselected = rows => {
    const rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1),
    });
  };
  getSize = () => Selectors.getRows(this.state).length;
  getRows = () => Selectors.getRows(this.state);

  setItensGrid = (event, index, value) => {
    this.setState({
      selectedPage: 0,
    });
    this.props.setItensGrid(value, 0);
  };
  handleOnClickPagination = prop => {
    this.setState({
      pageSelected: prop.selected,
    });
    this.props.handlePageClick(prop);
  };
  handleExclusion = async () => {
    console.log(this.state);
    const cols = await this.state.selectedIndexes.map(index => this.state.rows[index].id);

    await this.props.apaga(cols, this.state.pageSelected);
  };

  handleOnClick = () => {
    confirm('Você tem certeza que deseja excluir?').then(
      () => {
        this.handleExclusion();
      },
      () => {}
    );
  };
  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      }
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    };

    const rows =
      sortDirection === 'NONE' ? this.state.rows.slice(0) : this.state.rows.sort(comparer);

    this.setState({
      rows,
    });
  };

  handleFilterChange = filter => {
    const newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({
      filters: newFilters,
    });
  };

  rowGetter = rowIdx => Selectors.getRows(this.state)[rowIdx];
  // const rows = this.getRows();
  // return rows[rowIdx];

  renderButtonsOneSelection = () => {
    if (this.state.selectedIndexes.length === 1) {
      if (this.props.renderButtonsOneSelection) {
        const filteredRows = this.getRows();
        return this.props.renderButtonsOneSelection(
          filteredRows[this.state.selectedIndexes[0]],
          this.state.pageSelected
        );
      }
    }
  };

  renderButtonVariosSelection = () => {
    if (this.state.selectedIndexes.length > 0) {
      if (this.props.renderButtonVariosSelection) {
        const filteredRows = this.getRows();
        const selectedRows = this.state.selectedIndexes.map(index => filteredRows[index]);
        return this.props.renderButtonVariosSelection(selectedRows, this.state.pageSelected);
      }
    } else if (this.props.renderButtonVariosSelectionDisabled) {
      return this.props.renderButtonVariosSelectionDisabled();
    }
  };

  renderButtonApaga = () => {
    if (this.props.apaga) {
      let disabledExclusion = true;

      if (this.state.selectedIndexes.length > 0) {
        disabledExclusion = false;
      }

      return (
        <FlatButton
          onClick={this.handleOnClick}
          icon={<Glyphicon glyph="remove" style={{ color: '#FFFFFF' }} />}
          label="Excluir"
          fullWidth
          disabled={disabledExclusion}
          backgroundColor="#FF0000"
          hoverColor="#DF0101"
          labelStyle={{ color: '#FFFFFF' }}
        />
      );
    }
  };

  renderButtonNovo = () => {
    if (this.props.buttonNovo) {
      return (
        <Link to={this.props.buttonNovo}>
          <FlatButton
            icon={<Glyphicon glyph="plus" />}
            label="Novo"
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Link>
      );
    }
  };

  renderQtdPerPagina = () => {
    if (this.props.totalCount) {
      return (
        <div className="divQtdPorPagina">
          <SelectField
            style={{
              width: '150px',
            }}
            floatingLabelText="Qtd por página"
            value={this.props.items_grid}
            onChange={this.setItensGrid}>
            <MenuItem value={20} primaryText="Vinte" />
            <MenuItem value={50} primaryText="Cinquenta" />
            <MenuItem value={100} primaryText="Cem" />
            <MenuItem value={500} primaryText="Quinhentos" />
            <MenuItem value={1000} primaryText="Mil" />
          </SelectField>
        </div>
      );
    }
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const rows = this.state.rows.slice();

    if (this.props.maskRowsUpdated) {
      updated = this.props.maskRowsUpdated(updated);
    }

    for (let i = fromRow; i <= toRow; i++) {
      const rowToUpdate = rows[i];
      const updatedRow = update(rowToUpdate, { $merge: updated });

      rows[i] = updatedRow;
    }

    this.setState({
      rows,
    });
  };

  renderPagination = () => {
    if (this.props.totalCount) {
      return (
        <div className="divGridPagination">
          <ReactPaginate
            previousLabel={'anterior'}
            nextLabel={'próximo'}
            breakClassName={'break-me'}
            breakLabel={<a>...</a>}
            pageCount={Math.ceil(this.props.totalCount / this.props.items_grid)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handleOnClickPagination}
            containerClassName={'pagination pagination-sm'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      );
    }
  };

  render() {
    const buttonsInstance = (
      <div className="divGridButtons">
        <Row>
          <Col xs={12} sm={2}>
            {this.renderButtonNovo()}
          </Col>
          <Col xs={12} sm={2}>
            {this.renderButtonApaga()}
          </Col>
          <Col xs={12} sm={8}>
            {this.renderButtonsOneSelection()}
            {this.renderButtonVariosSelection()}
          </Col>
        </Row>
      </div>
    );

    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div>
        {this.renderQtdPerPagina()}

        <div>
          <ReactDataGrid
            columns={this.props.colunas}
            rowGetter={this.rowGetter}
            enableCellSelect
            rowsCount={this.getSize()}
            toolbar={<Toolbar enableFilter />}
            filterRowsButtonText="Filtros"
            onAddFilter={this.handleFilterChange}
            onGridSort={this.handleGridSort}
            onClearFilters={this.onClearFilters}
            onGridRowsUpdated={this.handleGridRowsUpdated}
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
        {this.renderPagination()}
        {buttonsInstance}
      </div>
    );
  }
}

export default confirmable(Grid);

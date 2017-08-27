import React, { Component } from 'react';
import connect from 'react-redux/connect';
import Link from 'react-router-dom/Link';

import RaisedButton from 'material-ui/RaisedButton';

import ReactDataGrid from 'react-data-grid';
import { confirmable } from 'react-confirm';
import { fetchVotacoes, setFilter, setSelectedIndexes, setRows, apaga } from '../../../actions';
import confirm from '../../generic/confirm';

const Selectors = require('react-data-grid-addons').Data.Selectors;
const Toolbar = require('react-data-grid-addons').Toolbar;

class PostsIndex extends Component {
  colunas = [
    {
      key: 'dsc_votacao',
      name: 'Nome',
      filterable: true,
      sortable: true,
    },
    {
      key: 'dat_inicio_votacao',
      name: 'Início',
      filterable: true,
      sortable: true,
    },

    {
      key: 'dat_fim_votacao',
      name: 'Fim',
      filterable: true,
      sortable: true,
    },
  ];
  onClearFilters = () => {
    // all filters removed
    this.props.setFilter({});
  };
  getRows = () => Selectors.getRows(this.props);
  getSize = () => this.getRows().length;
  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
  };
  componentDidMount() {
    this.props.fetchVotacoes();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.rowsFetched) {
      this.props.fetchVotacoes();
    }
  }
  handleFilterChange = (filter) => {
    const newFilters = Object.assign({}, this.props.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.props.setFilter(newFilters);
  };

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };

    const rows =
      sortDirection === 'NONE' ? this.props.rows.slice(0) : this.props.rows.sort(comparer);

    this.props.setRows(rows);
  };

  onRowsSelected = (rows) => {
    this.props.setSelectedIndexes(this.props.selectedIndexes.concat(rows.map(r => r.rowIdx)));
  };

  onRowsDeselected = (rows) => {
    const rowIndexes = rows.map(r => r.rowIdx);
    this.props.setSelectedIndexes(
      this.props.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1),
    );
  };

  handleExclusion = () => {
    const votacoes = this.props.selectedIndexes.map(index => this.props.rows[index].cod_votacao);

    this.props.apaga(votacoes);
  };

  handleOnClick = () => {
    confirm('Você tem certeza que deseja excluir?').then(
      () => {
        this.handleExclusion();
      },
      () => {},
    );
  };

  render() {
    const titulo = <h3>Votações</h3>;

    let disabledExclusion = true;

    if (this.props.selectedIndexes.length > 0) {
      disabledExclusion = false;
    }

    const buttonsInstance = (
      <div>
        <Link to="/votacao/nova">
          <RaisedButton type="button" label="Novo" primary />
        </Link>
        <RaisedButton
          type="button"
          label="Excluir"
          onClick={this.handleOnClick}
          secondary
          disabled={disabledExclusion}
        />
      </div>
    );

    return (
      <div>
        {titulo}
        <ReactDataGrid
          columns={this.colunas}
          rowGetter={this.rowGetter}
          enableCellSelect
          rowsCount={this.getSize()}
          toolbar={<Toolbar enableFilter />}
          filterRowsButtonText="Filtros"
          onAddFilter={this.handleFilterChange}
          onGridSort={this.handleGridSort}
          onClearFilters={this.onClearFilters}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.props.selectedIndexes,
            },
          }}
        />
        {buttonsInstance}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rows: state.posts.rows,
    filters: state.posts.filters,
    selectedIndexes: state.posts.selectedIndexes,
    rowsFetched: state.posts.rowsFetched,
  };
}

export default connect(mapStateToProps, {
  apaga,
  fetchVotacoes,
  setFilter,
  setSelectedIndexes,
  setRows,
})(confirmable(PostsIndex));

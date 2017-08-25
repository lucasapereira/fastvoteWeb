import React, { Component } from 'react';

import { compose } from 'react-apollo';
import UsuarioVotacao from './usuarioVotacao';
import { QueryVotacaoList } from './listVotacaoGraphql';

import MyLoader from '../../generic/myLoader';
import ReactPaginate from 'react-paginate';

class InfiniteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: -1,
      pageSelected: 0,
    };
  }

  buildElements = () =>
    this.props.rows.map((votacao) => {
      if (this.state.totalCount === -1) {
        this.state.totalCount = votacao.totalCount;
      }
      return (
        <UsuarioVotacao
          key={votacao.codVotacao}
          votacao={votacao}
          urep={this.props.urep}
          refetchLista={this.props.refetch}
        />
      );
    });

  handleOnClickPagination = (prop) => {
    this.setState({
      pageSelected: prop.selected,
    });
    this.props.loadMoreEntries(prop.selected * 5, 5).then(() => {});
  };

  renderPagination = () => {
    if (this.state.totalCount > 5) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ReactPaginate
            previousLabel={'anterior'}
            nextLabel={'próximo'}
            breakClassName={'break-me'}
            breakLabel={<a>...</a>}
            pageCount={Math.ceil(this.state.totalCount / 5)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handleOnClickPagination}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      );
    }
  };

  render = () => {
    if (this.props.loading) {
      return <MyLoader />;
    }
    return (
      <div>
        {this.buildElements()}
        {this.renderPagination()}
      </div>
    );
  };
}

export default compose(QueryVotacaoList)(InfiniteList);

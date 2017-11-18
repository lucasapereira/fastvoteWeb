import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { compose } from 'react-apollo';
import UsuarioVotacao from './usuarioVotacao';
import { QueryVotacaoList } from './listVotacaoGraphql';

import MyLoader from '../../generic/myLoader';

class InfiniteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 0,
    };
  }

  totalCount = -1;

  buildElements = () => {
    if (this.props.rows.length === 0) {
      return <div>Nenhuma votação cadastrada.</div>;
    }

    return this.props.rows.map(votacao => {
      if (this.totalCount === -1) {
        this.totalCount = votacao.totalCount;
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
  };

  handleOnClickPagination = prop => {
    this.setState({
      pageSelected: prop.selected,
    });
    this.props.loadMoreEntries(prop.selected * 5, 5).then(() => {});
  };

  renderPagination = () => {
    if (this.totalCount > 5) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ReactPaginate
            previousLabel={'anterior'}
            nextLabel={'próximo'}
            breakClassName={'break-me'}
            breakLabel={<a>...</a>}
            pageCount={Math.ceil(this.totalCount / 5)}
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
      <div className="containerMinhasVotacoes">
        {this.buildElements()}
        {this.renderPagination()}
        <div className="divisor" />
      </div>
    );
  };
}

export default compose(QueryVotacaoList)(InfiniteList);

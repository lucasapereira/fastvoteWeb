import React, { Component } from 'react';

import { compose } from 'react-apollo';
import UsuarioVotacao from './usuarioVotacao';
import { QueryVotacaoList } from './listVotacaoGraphql';

import MyLoader from '../../generic/myLoader';
import Infinite from 'react-infinite';

class InfiniteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: this.buildElements(0, 50),
      isInfiniteLoading: false,
      totalCount: -1,
    };
  }

  buildElements() {
    const elements = [];
    this.props.rows.map((votacao) => {
      elements.push(
        <div
          className="infinite-list-item"
          style={{
            height: this.props.height,
            lineHeight: this.props.lineHeight,
          }}
        >
          <div>
            <UsuarioVotacao
              key={votacao.codVotacao}
              votacao={votacao}
              urep={this.props.urep}
              refetchLista={this.props.refetch}
            />
          </div>
        </div>,
      );
    });
    return elements;
  }

  handleInfiniteLoad = () => {
    if (this.state.elements.length === this.state.totalCount) {
      this.setState({
        isInfiniteLoading: false,
      });
      return;
    }

    const that = this;
    this.setState({
      isInfiniteLoading: true,
    });

    this.props.loadMoreEntries(this.state.elements.length, 20).then(() => {
      if (this.state.totalCount === -1 && this.props.rows.length > 0) {
        this.state.totalCount = parseInt(this.props.rows[0].totalCount, 10);
      }

      const elemLength = that.state.elements.length;
      const newElements = that.buildElements(elemLength, elemLength + 100);
      that.setState({
        isInfiniteLoading: false,
        elements: that.state.elements.concat(newElements),
      });
    });
  };

  elementInfiniteLoad = () => <MyLoader />;

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }
    return (
      <Infinite
        elementHeight={51}
        containerHeight={window.innerHeight}
        infiniteLoadBeginEdgeOffset={200}
        onInfiniteLoad={this.handleInfiniteLoad}
        loadingSpinnerDelegate={this.elementInfiniteLoad()}
        isInfiniteLoading={this.state.isInfiniteLoading}
        timeScrollStateLastsForAfterUserScrolls={1000}
        useWindowAsScrollContainer
      >
        {this.state.elements}
      </Infinite>
    );
  }
}

export default compose(QueryVotacaoList)(InfiniteList);

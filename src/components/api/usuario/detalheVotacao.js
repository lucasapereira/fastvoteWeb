import React, { Component } from 'react';
import { QueryResultadoList } from '../../../graphql/resultado';
import MyLoader from '../../generic/myLoader';
import { compose } from 'react-apollo';
import { ProgressBar } from 'react-bootstrap';

class DetalheVotacao extends Component {
  renderDetalheVotacao = () => {
    if (!this.props.data.resultVotacao) {
      return;
    }

    let countItemResp = 1;

    return this.props.data.resultVotacao.nodes.map(row => {
      const arrResp = [];

      arrResp.push(
        <tr>
          <td width="10%">{countItemResp++}</td>
          <td width="40%">{row.dscResposta}</td>
          <td width="50%">
            <ProgressBar
              bsStyle="success"
              now={row.percentage}
              label={`${row.percentage.toFixed(2)}%`}
            />
          </td>
        </tr>
      );

      return arrResp;
    });
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro: {this.props.error.message}</div>;
    }
    return <tbody>{this.renderDetalheVotacao()}</tbody>;
  }
}
export default compose(QueryResultadoList)(DetalheVotacao);

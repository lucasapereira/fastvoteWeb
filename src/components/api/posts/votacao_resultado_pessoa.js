import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { QueryResultadoVotacaoPessoa } from './votacao_resultado_pessoa_graphql';
import Loader from 'halogen/PulseLoader';
import { Table, Panel } from 'react-bootstrap';

class ResultadoVotacaoPessoa extends Component {
  getRelatorio = () => {
    if (this.props.data.relatorioVotos) {
      return this.props.data.relatorioVotos.nodes.map(arrayItem =>
        (<tr key={arrayItem.nomCompletoPessoa}>
          <td>
            {arrayItem.nomCompletoPessoa}
          </td>
          <td>
            {arrayItem.dscResposta}
          </td>
          <td>
            {arrayItem.vlrPeso}
          </td>
          <td>
            {new Date(arrayItem.datHoraVoto).toLocaleString()}
          </td>
        </tr>),
      );
    }
  };
  render() {
    if (this.props.loading) {
      return <Loader color="#00BCD4" size="16px" margin="4px" />;
    }

    return (
      <div>
        <Panel header="Respostas" bsStyle="primary">
          <Table responsive>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Resposta</th>
                <th>Peso</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {this.getRelatorio()}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

export default compose(QueryResultadoVotacaoPessoa)(ResultadoVotacaoPessoa);

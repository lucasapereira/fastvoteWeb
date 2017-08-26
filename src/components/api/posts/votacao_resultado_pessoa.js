import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { QueryResultadoVotacaoPessoa } from './votacao_resultado_pessoa_graphql';
import { Table } from 'react-bootstrap';

import MyLoader from '../../generic/myLoader';

class ResultadoVotacaoPessoa extends Component {
  getRelatorio = () => {
    if (this.props.rows) {
      return this.props.rows.map(arrayItem =>
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
            {arrayItem.datHoraVoto}
          </td>
          <td>
            {arrayItem.numCpfPessoa}
          </td>
          <td>
            {arrayItem.numTelefone}
          </td>
          <td>
            {arrayItem.dscEmail}
          </td>
        </tr>),
      );
    }
  };
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    // <Table striped bordered condensed hover responsive>
    return (
      <div>
        <div className="subtitleReport">Participantes</div>

        <Table striped responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Resposta</th>
              <th>Peso</th>
              <th>Hora</th>
              <th>Cpf</th>
              <th>Telefone</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {this.getRelatorio()}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default compose(QueryResultadoVotacaoPessoa)(ResultadoVotacaoPessoa);

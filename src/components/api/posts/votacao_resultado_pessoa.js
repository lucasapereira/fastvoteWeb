import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { QueryResultadoVotacaoPessoa } from './votacao_resultado_pessoa_graphql';
import { Table } from 'react-bootstrap';

import MyLoader from '../../generic/myLoader';

// Define a quantidade de rows na grid por pagina
const numItensPerPage = 38;

class ResultadoVotacaoPessoa extends Component {
  /* componentWillMount() {
    this.props.loadMoreEntries(this.props.offset, this.props.limit);
  } */

  renderPage = (content, page) => {
    if (this.props.rows) {
      return (
        <div id={`page${page}`} className="divResultadoReport">
          {this.props.renderHeader()}
          <div className="subtitleReport">Participantes</div>
          <div id="divContent">
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
              <tbody>{content}</tbody>
            </Table>
          </div>
          {this.props.renderFooter(page)}
        </div>
      );
    }
  };

  getContent = () => {
    if (this.props.rows) {
      const qtdPages = Math.ceil(this.props.rows.length / numItensPerPage);
      this.props.setNumPages(qtdPages);

      const itensRestante = this.props.rows.length % numItensPerPage;

      let arrayContent = [];
      const arrayPages = [];
      let countItens = 1;
      let countPage = 1;
      let flgLastPage = false;

      this.props.rows.map(arrayItem => {
        arrayContent.push(
          <tr key={arrayItem.nomCompletoPessoa}>
            <td>{arrayItem.nomCompletoPessoa}</td>
            <td>{arrayItem.dscResposta}</td>
            <td>{arrayItem.vlrPeso}</td>
            <td>{arrayItem.datHoraVoto}</td>
            <td>{arrayItem.numCpfPessoa}</td>
            <td>{arrayItem.numTelefone}</td>
            <td>{arrayItem.dscEmail}</td>
          </tr>
        );

        if (countPage === qtdPages && countItens === itensRestante) {
          flgLastPage = true;
        }

        if (countItens === numItensPerPage || flgLastPage) {
          if (flgLastPage) {
            const qtsItensComplete = numItensPerPage - itensRestante;

            for (let itemComplete = 0; itemComplete < qtsItensComplete; itemComplete++) {
              arrayContent.push(
                <tr key={`${arrayItem.nomCompletoPessoa}-${itemComplete}`}>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#C0C0C0' }}>
                    ***
                  </td>
                </tr>
              );
            }
          }

          arrayPages.push(this.renderPage(arrayContent, ++countPage));
          arrayContent = [];
          countItens = 0;
        }

        countItens++;

        return arrayContent;
      });

      return arrayPages;
    }
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return <div>{this.getContent()}</div>;
  }
}

export default compose(QueryResultadoVotacaoPessoa)(ResultadoVotacaoPessoa);

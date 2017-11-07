import React, { Component } from 'react';

import { compose } from 'react-apollo';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Table, Row, Col } from 'react-bootstrap';

import { QueryResultadoList } from '../../../graphql/resultado';

import MyLoader from '../../generic/myLoader';

const colorArray = [
  '#CDCD00',
  '#FFDAB9',
  '#1E90FF',
  '#A2CD5A',
  '#708090',
  '#87CEEB',
  '#9ACD32',
  '#FFFACD',
  '#00CED1',
  '#43CD80',
  '#6495ED',
  '#5F9EA0',
  '#7EC0EE',
  '#8470FF',
  '#006400',
  '#1E90FF',
  '#4169E1',
  '#00FF7F',
  '#836FFF',
  '#FFA07A',
  '#FFD700',
  '#D02090',
  '#FF7F00',
  '#6E7B8B',
  '#FF4500',
  '#CD4F39',
  '#DAA520',
  '#F4A460',
  '#FF6EB4',
  '#00F5FF',
];

class ResultadoVotacaoGrafico extends Component {
  /* getLabel = () => {
    if (this.props.data.resultVotacao) {
      return this.props.data.resultVotacao.nodes[0].dscVotacao;
    }
  }; */

  renderResultadoAgregado = () => {
    const arrayVotos = this.props.data.resultVotacao.nodes.map(arrayItem => (
      <tr key={arrayItem.dscResposta}>
        <td>{arrayItem.dscResposta}</td>
        <td>{arrayItem.multi}</td>
      </tr>
    ));

    return arrayVotos;
  };

  renderDadosDaVotacao = () => {
    if (this.props.data.resultVotacao) {
      return (
        <div>
          <div className="titleReport">{this.props.data.resultVotacao.nodes[0].dscVotacao}</div>
          <b>Pergunta:</b>{' '}
          <div style={{ fontSize: '120%' }}>
            {this.props.data.resultVotacao.nodes[0].dscPergunta}
          </div>
          <div className="subtitleReport">Resultado Agregado</div>
          <Table striped responsive>
            <thead>
              <tr>
                <th>Opção</th>
                <th>Qtd. Votos</th>
              </tr>
            </thead>
            <tbody>{this.renderResultadoAgregado()}</tbody>
          </Table>
        </div>
      );
    }
  };

  houveVotos = () => {
    let flg = false;
    if (this.props.data.resultVotacao) {
      this.props.data.resultVotacao.nodes.forEach(arrayItem => {
        if (parseFloat(arrayItem.multi) > 0) {
          flg = true;
        }
      });
    }
    return flg;
  };

  getData = () => {
    const arrayLabel = [];
    const arrayColor = [];
    const arrayData = [];

    let index = 0;

    if (this.props.data.resultVotacao) {
      this.props.data.resultVotacao.nodes.forEach(arrayItem => {
        arrayLabel[index] = `${arrayItem.dscResposta} - [${arrayItem.multi}]`;
        arrayColor[index] = colorArray[index];
        arrayData[index] = arrayItem.multi;

        index++;
      });
    }

    return {
      labels: arrayLabel,
      datasets: [
        {
          label: this.props.data.resultVotacao.nodes[0].dscPergunta,
          data: arrayData,
          backgroundColor: arrayColor,
          hoverBackgroundColor: arrayColor,
        },
      ],
    };
  };

  options = {
    yAxisID: 0,
  };

  renderGraficos = () => {
    if (this.houveVotos()) {
      return (
        <div>
          <div className="subtitleReport">Gráficos</div>
          <div className="divGraficos" id="divGraficos">
            <Row>
              <Col xs={12} md={6}>
                <div className="graphContainer">
                  <Doughnut data={this.getData()} height={250} />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="graphContainer">
                  <Bar data={this.getData()} height={250} options={this.options} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      );
    }

    return <div>Nenhum voto computado até o momento.</div>;
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div id="page1" className="divResultadoReport">
        {this.props.renderHeader()}
        <div id="divContent">
          {this.renderDadosDaVotacao()}
          {this.renderGraficos()}
        </div>
        {this.props.renderFooter(1)}
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ResultadoVotacaoGrafico);

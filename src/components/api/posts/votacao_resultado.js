import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Doughnut, Bar } from 'react-chartjs-2';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import html2canvas from 'html2canvas';
import Icon from 'react-icon';
import { Table, Row, Col } from 'react-bootstrap';

import { QueryResultadoList } from '../../../graphql/resultado';
import ResultadoVotacaoPessoa from './votacao_resultado_pessoa';
import MyLoader from '../../generic/myLoader';

import jsPDF from 'jspdf';
import logoImg from '../../../assets/imgs/logo.png';
import logoImgGray from '../../../assets/imgs/logoGray.png';

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

class ResultadoVotacao extends Component {
  state = {
    printingPdf: false,
  };

  printDocument = () => {
    this.setState({
      printingPdf: true,
    });
    /* eslint no-undef: 0 */

    const input = document.getElementById('divToPrint');
    // const header = document.getElementById('headerReport');
    // const footer = document.getElementById('footerReport');

    // headerReport
    // footerReport

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      /* eslint new-cap: 0 */
      const pdf = new jsPDF(
        {
          //  orientation: 'landscape',
          //  unit: 'in',
          //  format: [4, 2],
        },
      );
      pdf.addImage(imgData, 'JPEG', 0, 0);

      // pdf.output('dataurlnewwindow');
      pdf.save('relatorio.pdf');
      this.setState({
        printingPdf: false,
      });
    });
  };

  // react dom server to static html (converter pagina react p html)

  getLabel = () => {
    if (this.props.data.resultVotacao) {
      return this.props.data.resultVotacao.nodes[0].dscVotacao;
    }
  };

  houveVotos = () => {
    let flg = false;
    if (this.props.data.resultVotacao) {
      this.props.data.resultVotacao.nodes.forEach((arrayItem) => {
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
      this.props.data.resultVotacao.nodes.forEach((arrayItem) => {
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
          label: 'Verificar como mudar',
          data: arrayData,
          backgroundColor: arrayColor,
          hoverBackgroundColor: arrayColor,
        },
      ],
    };
  };

  buttonExportaPdf = () => {
    Icon.setDefaultFontPrefix('glyphicon');

    if (this.state.printingPdf) {
      return <MyLoader />;
    }
    return (
      <div>
        <FlatButton
          onClick={this.printDocument}
          icon={<Icon glyph="file" />}
          style={{ margin: 12 }}
          label="Exportar para PDF"
          fullWidth
        />
      </div>
    );
    /*
    <FlatButton
        backgroundColor="#e8e8e8"
        label="Detalhes"
        fullWidth
        disabled
        primary
        icon={<Icon glyph="stats" />}
      />
      */
  };

  renderGraficos = () => {
    if (this.houveVotos()) {
      return (
        <div>
          Resultados:{this.getLabel()}
          <hr />
          <div className="subtitleReport">Gráficos</div>
          <Row>
            <Col xs={12} md={6} className="graphDiv">
              <div id="graph1" className="graph1">
                <Doughnut data={this.getData()} />
              </div>
            </Col>
            <Col xs={12} md={6} className="graphDiv">
              <div id="graph2" className="graph2">
                <Bar
                  data={this.getData()}
                  options={{
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    return <div>Nenhum voto computado até o momento.</div>;
  };

  renderResultadoAgregado = () =>
    this.props.data.resultVotacao.nodes.map(arrayItem =>
      (<tr key={arrayItem.dscResposta}>
        <td>
          {arrayItem.dscResposta}
        </td>
        <td>
          {arrayItem.multi}
        </td>
      </tr>),
    );

  renderDadosDaVotacao = () => {
    if (this.props.data.resultVotacao) {
      return (
        <div>
          <div className="titleReport">{this.props.data.resultVotacao.nodes[0].dscVotacao}</div>
          <b>Pergunta:</b>{' '}
          <div className="perguntaLabel">{this.props.data.resultVotacao.nodes[0].dscPergunta}</div>
          <div className="subtitleReport">Resultado Agregado</div>
          <Table striped responsive>
            <thead>
              <tr>
                <th>Opção</th>
                <th>Qtd. Votos</th>
              </tr>
            </thead>
            <tbody>
              {this.renderResultadoAgregado()}
            </tbody>
          </Table>
        </div>
      );
    }
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    // <Paper className="paperVotacao" zDepth={2} rounded>
    // <div style={{ width: '500px' }}>
    //
    return (
      <div className="container">
        <div className="divTopoRelatorio">
          <Row className="show-grid">
            <Col xs={12} sm={8}>
              <div className="pageHeader">Relatório de resultado da votação</div>
            </Col>
            <Col xs={12} sm={4}>
              {this.buttonExportaPdf()}
            </Col>
          </Row>
        </div>
        <Card className="cardResultado">
          <div id="divToPrint" className="divToPrint">
            <div id="headerReport" className="headerReport">
              <img alt={'FastVote'} src={logoImg} />
            </div>
            {this.renderDadosDaVotacao()}
            {this.renderGraficos()}
            <ResultadoVotacaoPessoa codVotacao={this.props.match.params.codVotacao} />
            <div id="footerReport" className="footerReport">
              <img alt={'FastVote'} src={logoImgGray} />
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ResultadoVotacao);

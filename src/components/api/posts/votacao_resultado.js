import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Doughnut, Bar } from 'react-chartjs-2';
import FlatButton from 'material-ui/FlatButton';
import Icon from 'react-icon';
import { Table, Row, Col } from 'react-bootstrap';

import { QueryResultadoList } from '../../../graphql/resultado';

import ResultadoVotacaoPessoa from './votacao_resultado_pessoa';
import MyLoader from '../../generic/myLoader';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    numPages: 1,
  };

  setNumPages = (x) => {
    this.setState({
      numPages: x,
    });
  };

  printDocument = async () => {
    this.setState({
      printingPdf: true,
    });

    const pdf = new jsPDF('p', 'pt', 'a4');
    let input;
    const imgWidth = 595;
    // const pageHeight = 842;

    const pages = this.state.numPages + 1;

    const results = [];
    for (let i = 1; i < pages + 1; i++) {
      input = document.getElementById(`page${i}`);
      input.style.transform = input.style.webkitTransform = 'scale(2)';
      input.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';

      const options = {
        padding: 5,
        pagesplit: true,
        dpi: 192,
        width: input.offsetWidth * 2,
        height: input.offsetHeight * 2,
      };

      results.push(html2canvas(input, options));

      input.style.transform = input.style.webkitTransform = 'scale(1)';
      input.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';
    }

    const arrImgsJaCriadas = await Promise.all(results);

    for (let i = 0; i < pages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const canvas = arrImgsJaCriadas[i];
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    const currentTime = new Date();
    pdf.save(`Relatório${currentTime}.pdf`);

    this.setState({
      printingPdf: false,
    });
  };

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
          label: this.props.data.resultVotacao.nodes[0].dscPergunta,
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
      return (
        <div className="divBtnExportaRelatorio">
          <MyLoader />
        </div>
      );
    }
    return (
      <div className="divBtnExportaRelatorio">
        <FlatButton
          onClick={this.printDocument}
          icon={<Icon glyph="file" />}
          label="Exportar para PDF"
          fullWidth
        />
      </div>
    );
  };

  renderGraficos = () => {
    if (this.houveVotos()) {
      return (
        <div>
          {this.renderSubtitleReport('Gráficos')}
          <div id="divGraficos">
            <Row>
              <Col xs={12} md={6}>
                <div id="graph1" className="graphContainer">
                  <Doughnut data={this.getData()} />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div id="graph2" className="graphContainer">
                  <Bar data={this.getData()} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      );
    }

    return <div>Nenhum voto computado até o momento.</div>;
  };

  renderResultadoAgregado = () =>
    this.props.data.resultVotacao.nodes.map(arrayItem => (
      <tr key={arrayItem.dscResposta}>
        <td>{arrayItem.dscResposta}</td>
        <td>{arrayItem.multi}</td>
      </tr>
    ));

  renderDadosDaVotacao = () => {
    if (this.props.data.resultVotacao) {
      return (
        <div>
          {this.renderTitleReport(this.props.data.resultVotacao.nodes[0].dscVotacao)}
          <b>Pergunta:</b>{' '}
          <div style={{ fontSize: '120%' }}>
            {this.props.data.resultVotacao.nodes[0].dscPergunta}
          </div>
          {this.renderSubtitleReport('Resultado Agregado')}
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

  renderTitleReport = text => <div className="titleReport">{text}</div>;

  renderSubtitleReport = text => <div className="subtitleReport">{text}</div>;

  renderHeader = () => (
    <div id="headerReport" className="headerReport">
      <img alt={'FastVote'} src={logoImg} />
    </div>
  );

  renderFooter = (numPage) => {
    const page = numPage || '';

    return (
      <div id="footerReport" className="footerReport">
        <img alt={'FastVote'} src={logoImgGray} />
        <span className="footerPageLabel">{page}</span>
      </div>
    );
  };

  renderPages = () => (
    <div idName="containerReport" className="containerReport">
      <div id="page1" className="divResultado">
        {this.renderHeader()}
        <div id="divContent">
          {this.renderDadosDaVotacao()}
          {this.renderGraficos()}
        </div>
        {this.renderFooter(1)}
      </div>

      <ResultadoVotacaoPessoa
        codVotacao={this.props.match.params.codVotacao}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        setNumPages={this.setNumPages}
      />
    </div>
  );

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
          <Row>
            <Col xs={12} sm={8}>
              <div className="pageTitle">Relatório de resultado da votação</div>
            </Col>
            <Col xs={12} sm={4}>
              {this.buttonExportaPdf()}
            </Col>
          </Row>
        </div>

        {this.renderPages()}
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ResultadoVotacao);

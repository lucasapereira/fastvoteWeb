import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Doughnut, Bar } from 'react-chartjs-2';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import Icon from 'react-icon';
import { Table, Row, Col } from 'react-bootstrap';

import { QueryResultadoList } from '../../../graphql/resultado';
import ResultadoVotacaoPessoa from './votacao_resultado_pessoa';
import MyLoader from '../../generic/myLoader';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';

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

  printDocument = async () => {
    this.setState({
      printingPdf: true,
    });

    //  const options = { padding: 5, pagesplit: true, dpi: 192 };
    const pdf = new jsPDF('p', 'pt', 'a4');

    const header = document.getElementById('divHeader');

    header.style.transform = header.style.webkitTransform = 'scale(2)';
    header.style.transformOrigin = header.style.webkitTransformOrigin = '0 0';

    const headerOptions = {
      padding: 5,
      dpi: 192,
      width: header.offsetWidth * 2,
      height: header.offsetHeight * 2,
    };

    const headerCanvas = await html2canvas(header, headerOptions);
    const headerData = headerCanvas.toDataURL('image/png');

    const footer = document.getElementById('divFooter');

    footer.style.transform = footer.style.webkitTransform = 'scale(2)';
    footer.style.transformOrigin = footer.style.webkitTransformOrigin = '0 0';

    const footerOptions = {
      padding: 5,
      dpi: 192,
      width: footer.offsetWidth * 2,
      height: footer.offsetHeight * 2,
    };

    const footerCanvas = await html2canvas(footer, footerOptions);
    const footerData = footerCanvas.toDataURL('image/png');

    const input = document.getElementById('divToPrint');

    input.style.transform = input.style.webkitTransform = 'scale(2)';
    input.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';

    const options = {
      padding: 5,
      pagesplit: true,
      dpi: 192,
      width: input.offsetWidth * 2,
      height: input.offsetHeight * 2,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // criar constante de topo e footer para acrescentar nas paginas

      //   const footerHtml = ReactDOMServer.renderToStaticMarkup(this.renderFooter());

      //   console.log('topo', topoHtml);

      const imgWidth = 595;
      const pageHeight = 842;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      console.log('canvas.height', canvas.height);
      console.log('canvas.width', canvas.width);

      console.log('heightLeft', heightLeft);

      console.log('imgHeight', imgHeight);

      pdf.addImage(headerData, 'PNG', 0, position, imgWidth, 30);

      pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, pageHeight - 60);

      pdf.addImage(footerData, 'PNG', 0, 812, imgWidth, 30);

      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.setPage(2);

        position = heightLeft - imgHeight;
        pdf.addImage(headerData, 'PNG', 0, position, imgWidth, 30);
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        pdf.addImage(footerData, 'PNG', 0, 812, imgWidth, 30);
        heightLeft -= pageHeight;
      }

      const currentTime = new Date();
      pdf.save(`Relatório${currentTime}.pdf`);
      input.style.transform = input.style.webkitTransform = 'scale(1)';
      input.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';
      header.style.transform = input.style.webkitTransform = 'scale(1)';
      header.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';
      footer.style.transform = input.style.webkitTransform = 'scale(1)';
      footer.style.transformOrigin = input.style.webkitTransformOrigin = '0 0';
      this.setState({
        printingPdf: false,
      });
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
          Resultados:{this.getLabel()}
          <hr />
          {this.renderSubtitleReport('Gráficos')}
          <div id="divGraficos">
            <Row>
              <Col xs={12} md={6}>
                <div id="graph1" className="graphContainer">
                  <Doughnut data={this.getData()} />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div id="graph2">
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

  renderTitleReport = text => (
    <div
      style={{
        fontSize: '160%',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 20,
        borderBottomStyle: 'groove',
        borderBottomWidth: 2,
        borderBottomColor: '#b4b4b4',
      }}
    >
      {text}
    </div>
  );

  renderSubtitleReport = text => (
    <div
      style={{
        fontSize: '140%',
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: '#b4b4b4',
        color: '#c0c0c0',
      }}
    >
      {text}
    </div>
  );

  renderHeader = () => (
    <div id="headerReport" style={{ padding: 10, backgroundColor: '#000000', textAlign: 'right' }}>
      <img alt={'FastVote'} src={logoImg} />
    </div>
  );

  renderFooter = () => (
    <div
      id="footerReport"
      style={{
        padding: 10,
        textAlign: 'center',
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
      }}
    >
      <img alt={'FastVote'} src={logoImgGray} />
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

        <Card className="cardResultado">
          <div id="divHeader" className="divToPrint">
            {this.renderHeader()}
          </div>
          <div id="divToPrint" className="divToPrint">
            {this.renderDadosDaVotacao()}
            {this.renderGraficos()}
            <ResultadoVotacaoPessoa codVotacao={this.props.match.params.codVotacao} />
          </div>
          <div id="divFooter" className="divToPrint">
            {this.renderFooter()}
          </div>
        </Card>
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ResultadoVotacao);

import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Doughnut, Bar } from 'react-chartjs-2';
import { QueryResultadoList } from '../../../graphql/resultado';
import ResultadoVotacaoPessoa from './votacao_resultado_pessoa';
import RaisedButton from 'material-ui/RaisedButton';
import html2canvas from 'html2canvas';
import MyLoader from '../../generic/myLoader';

import jsPDF from 'jspdf';

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
    const input = document.getElementById('divToPrint');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(
        {
          //   orientation: 'landscape',
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
          label: 'My First dataset',
          data: arrayData,
          backgroundColor: arrayColor,
          hoverBackgroundColor: arrayColor,
        },
      ],
    };
  };

  buttonExportaPdf = () => {
    if (this.state.printingPdf) {
      return <MyLoader />;
    }
    return <RaisedButton onClick={this.printDocument} label="Exportar para PDF" />;
  };

  renderGraficos = () => {
    if (this.houveVotos()) {
      return (
        <div>
          Resultados:{this.getLabel()}
          <Doughnut data={this.getData()} width={100} height={50} />
          <Bar
            data={this.getData()}
            width={100}
            height={50}
            options={{
              maintainAspectRatio: true,
            }}
          />
        </div>
      );
    }
    return <div>Nenhum voto computado até o momento.</div>;
  };

  renderResultadoAgregado = () =>
    this.props.data.resultVotacao.nodes.map(arrayItem =>
      (<div>
        {arrayItem.dscResposta}: {arrayItem.multi}
      </div>),
    );

  renderDadosDaVotacao = () => {
    if (this.props.data.resultVotacao) {
      return (
        <div>
          Votação: {this.props.data.resultVotacao.nodes[0].dscVotacao} <br />
          Pergunta: {this.props.data.resultVotacao.nodes[0].dscVotacao} <br />
          {this.renderResultadoAgregado()}
        </div>
      );
    }
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div style={{ width: '500px' }}>
        <div className="mb5">
          {this.buttonExportaPdf()}
        </div>
        <div id="divToPrint" style={{ margin: 20, padding: 20 }}>
          {this.renderDadosDaVotacao()}
          {this.renderGraficos()}
          <ResultadoVotacaoPessoa codVotacao={this.props.match.params.codVotacao} />
        </div>
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ResultadoVotacao);

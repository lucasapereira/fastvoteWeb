import React, { Component } from 'react';
// import { compose } from 'react-apollo';
// import { Doughnut, Bar } from 'react-chartjs-2';
import FlatButton from 'material-ui/FlatButton';
// import { Table, Row, Col } from 'react-bootstrap';
import { Row, Col, Glyphicon } from 'react-bootstrap';

// import { QueryResultadoList } from '../../../graphql/resultado';

import ResultadoVotacaoPessoa from './votacao_resultado_pessoa';
import ResultadoVotacaoGrafico from './votacao_resultado_grafico';
import MyLoader from '../../generic/myLoader';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import logoImg from '../../../assets/imgs/logo.png';
import logoImgGray from '../../../assets/imgs/logoGray.png';

class ResultadoVotacao extends Component {
  state = {
    printingPdf: false,
    numPages: 1,
  };

  setNumPages = x => {
    this.setState({
      numPages: x,
    });
  };

  printDocument = async () => {
    this.setState({
      printingPdf: true,
    });

    const pdf = new jsPDF('p', 'pt', 'a4', true);
    let input;
    const imgWidth = 595;
    // const pageHeight = 842;

    const pages = this.state.numPages + 1;

    const results = [];
    for (let i = 1; i < pages + 1; i++) {
      input = document.getElementById(`page${i}`);

      input.style.transform = input.style.width = '1190px';
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

      input.style.transform = input.style.width = '100%';
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

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    }

    const currentTime = new Date();
    pdf.save(`Relatório${currentTime}.pdf`);

    this.setState({
      printingPdf: false,
    });
  };

  renderHeader = () => (
    <div id="headerReport" className="headerReport">
      <img alt={'FastVote'} src={logoImg} />
    </div>
  );

  renderFooter = numPage => {
    const page = numPage || '';

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yy = today.getFullYear();
    let hh = today.getHours();
    let ii = today.getMinutes();
    let ss = today.getSeconds();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    hh = hh < 10 ? '0' + hh : hh;
    ii = ii < 10 ? '0' + ii : ii;
    ss = ss < 10 ? '0' + ss : ss;

    today = dd + '/' + mm + '/' + yy + ' ' + hh + ':' + ii + ':' + ss;

    return (
      <div id="footerReport" className="footerReport">
        <span className="footerDateLabel">{today}</span>
        <img alt={'FastVote'} src={logoImgGray} />
        <span className="footerPageLabel">{page}</span>
      </div>
    );
  };

  buttonExportaPdf = () => {
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
          icon={<Glyphicon glyph="file" />}
          label="Exportar para PDF"
          fullWidth
        />
      </div>
    );
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div className="container">
        <div className="divTopoRelatorio">
          <Row>
            <Col xs={12} sm={8}>
              <div className="pageTitle">Relatório de resultado da votação</div>
            </Col>
            <Col xsHidden sm={4}>
              {this.buttonExportaPdf()}
            </Col>
          </Row>
        </div>

        <div idName="containerReport" className="containerReport">
          <ResultadoVotacaoGrafico
            codVotacao={this.props.match.params.codVotacao}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
          />

          <ResultadoVotacaoPessoa
            codVotacao={this.props.match.params.codVotacao}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
            setNumPages={this.setNumPages}
          />
        </div>
      </div>
    );
  }
}

export default ResultadoVotacao;

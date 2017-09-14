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

import logoImg from '../../../assets/imgs/logo.png';
import logoImgGray from '../../../assets/imgs/logoGray.png';


/**
 * covert canvas to image
 * and save the image file
 */

const Canvas2Image = (function () {
  // check if support sth.
  const $support = (function () {
    let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

    return {
      canvas: !!ctx,
      imageData: !!ctx.getImageData,
      dataURL: !!canvas.toDataURL,
      btoa: !!window.btoa,
    };
  }());

  const downloadMime = 'image/octet-stream';

  function scaleCanvas(canvas, width, height) {
    let w = canvas.width,
      h = canvas.height;
    if (width == undefined) {
      width = w;
    }
    if (height == undefined) {
      height = h;
    }

    const retCanvas = document.createElement('canvas');
    const retCtx = retCanvas.getContext('2d');
    retCanvas.width = width;
    retCanvas.height = height;
    retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    return retCanvas;
  }

  function getDataURL(canvas, type, width, height) {
    canvas = scaleCanvas(canvas, width, height);
    return canvas.toDataURL(type);
  }

  function saveFile(strData) {
    document.location.href = strData;
  }

  function genImage(strData) {
    const img = document.createElement('img');
    img.src = strData;
    return img;
  }
  function fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    const r = type.match(/png|jpeg|bmp|gif/)[0];
    return `image/${r}`;
  }
  function encodeData(data) {
    if (!window.btoa) { throw 'btoa undefined'; }
    let str = '';
    if (typeof data === 'string') {
      str = data;
    } else {
      for (let i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i]);
      }
    }

    return btoa(str);
  }
  function getImageData(canvas) {
    let w = canvas.width,
      h = canvas.height;
    return canvas.getContext('2d').getImageData(0, 0, w, h);
  }
  function makeURI(strData, type) {
    return `data:${type};base64,${strData}`;
  }


  /**
     * create bitmap image
     * 按照规则生成图片响应头和响应体
     */
  const genBitmapImage = function (oData) {
    //
    // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
    // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
    //

    const biWidth = oData.width;
    const biHeight	= oData.height;
    const biSizeImage = biWidth * biHeight * 3;
    const bfSize = biSizeImage + 54; // total header size = 54 bytes

    //
    //  typedef struct tagBITMAPFILEHEADER {
    //  	WORD bfType;
    //  	DWORD bfSize;
    //  	WORD bfReserved1;
    //  	WORD bfReserved2;
    //  	DWORD bfOffBits;
    //  } BITMAPFILEHEADER;
    //
    const BITMAPFILEHEADER = [
      // WORD bfType -- The file type signature; must be "BM"
      0x42, 0x4D,
      // DWORD bfSize -- The size, in bytes, of the bitmap file
      bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
      // WORD bfReserved1 -- Reserved; must be zero
      0, 0,
      // WORD bfReserved2 -- Reserved; must be zero
      0, 0,
      // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
      54, 0, 0, 0,
    ];

      //
      //  typedef struct tagBITMAPINFOHEADER {
      //  	DWORD biSize;
      //  	LONG  biWidth;
      //  	LONG  biHeight;
      //  	WORD  biPlanes;
      //  	WORD  biBitCount;
      //  	DWORD biCompression;
      //  	DWORD biSizeImage;
      //  	LONG  biXPelsPerMeter;
      //  	LONG  biYPelsPerMeter;
      //  	DWORD biClrUsed;
      //  	DWORD biClrImportant;
      //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
      //
    const BITMAPINFOHEADER = [
      // DWORD biSize -- The number of bytes required by the structure
      40, 0, 0, 0,
      // LONG biWidth -- The width of the bitmap, in pixels
      biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
      // LONG biHeight -- The height of the bitmap, in pixels
      biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
      // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
      1, 0,
      // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
      // has a maximum of 2^24 colors (16777216, Truecolor)
      24, 0,
      // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
      0, 0, 0, 0,
      // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
      biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
      // LONG biXPelsPerMeter, unused
      0, 0, 0, 0,
      // LONG biYPelsPerMeter, unused
      0, 0, 0, 0,
      // DWORD biClrUsed, the number of color indexes of palette, unused
      0, 0, 0, 0,
      // DWORD biClrImportant, unused
      0, 0, 0, 0,
    ];

    const iPadding = (4 - ((biWidth * 3) % 4)) % 4;

    const aImgData = oData.data;

    let strPixelData = '';
    const biWidth4 = biWidth << 2;
    let y = biHeight;
    const fromCharCode = String.fromCharCode;

    do {
      const iOffsetY = biWidth4 * (y - 1);
      let strPixelRow = '';
      for (let x = 0; x < biWidth; x++) {
        const iOffsetX = x << 2;
        strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) +
                   fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) +
                   fromCharCode(aImgData[iOffsetY + iOffsetX]);
      }

      for (let c = 0; c < iPadding; c++) {
        strPixelRow += String.fromCharCode(0);
      }

      strPixelData += strPixelRow;
    } while (--y);

    const strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

    return strEncoded;
  };

    /**
     * saveAsImage
     * @param canvasElement
     * @param {String} image type
     * @param {Number} [optional] png width
     * @param {Number} [optional] png height
     */
  const saveAsImage = function (canvas, width, height, type) {
    if ($support.canvas && $support.dataURL) {
      if (typeof canvas === 'string') { canvas = document.getElementById(canvas); }
      if (type == undefined) { type = 'png'; }
      type = fixType(type);
      if (/bmp/.test(type)) {
        const data = getImageData(scaleCanvas(canvas, width, height));
        var strData = genBitmapImage(data);
        saveFile(makeURI(strData, downloadMime));
      } else {
        var strData = getDataURL(canvas, type, width, height);
        saveFile(strData.replace(type, downloadMime));
      }
    }
  };

  const convertToImage = function (canvas, width, height, type) {
    if ($support.canvas && $support.dataURL) {
      if (typeof canvas === 'string') { canvas = document.getElementById(canvas); }
      if (type == undefined) { type = 'png'; }
      type = fixType(type);

      if (/bmp/.test(type)) {
        const data = getImageData(scaleCanvas(canvas, width, height));
        var strData = genBitmapImage(data);
        return genImage(makeURI(strData, 'image/bmp'));
      }
      var strData = getDataURL(canvas, type, width, height);
      return genImage(strData);
    }
  };


  return {
    saveAsImage,
    saveAsPNG(canvas, width, height) {
      return saveAsImage(canvas, width, height, 'png');
    },
    saveAsJPEG(canvas, width, height) {
      return saveAsImage(canvas, width, height, 'jpeg');
    },
    saveAsGIF(canvas, width, height) {
      return saveAsImage(canvas, width, height, 'gif');
    },
    saveAsBMP(canvas, width, height) {
      return saveAsImage(canvas, width, height, 'bmp');
    },

    convertToImage,
    convertToPNG(canvas, width, height) {
      return convertToImage(canvas, width, height, 'png');
    },
    convertToJPEG(canvas, width, height) {
      return convertToImage(canvas, width, height, 'jpeg');
    },
    convertToGIF(canvas, width, height) {
      return convertToImage(canvas, width, height, 'gif');
    },
    convertToBMP(canvas, width, height) {
      return convertToImage(canvas, width, height, 'bmp');
    },
  };
}());
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

    // Constuindo Header
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

    // Construindo footer
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

    // Inicio Relatorio

    const input = document.getElementById('divContent');

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
      console.log('Aooo', imgData);
      // criar constante de topo e footer para acrescentar nas paginas

      //   const footerHtml = ReactDOMServer.renderToStaticMarkup(this.renderFooter());

      //   console.log('topo', topoHtml);

      const imgWidth = 595;
      const pageHeight = 842;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;
      const position = 0;

      console.log('canvas.height', canvas.height);
      console.log('canvas.width', canvas.width);

      console.log('heightLeft', heightLeft);

      console.log('imgHeight', imgHeight);

      pdf.addImage(headerData, 'PNG', 0, position, imgWidth, 30);

      pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, imgHeight);

      pdf.addImage(footerData, 'PNG', 0, 812, imgWidth, 30);

      heightLeft -= pageHeight;
      const ctx = pdf.context2d;
      const pad = 10;
      const textHeight = 20;

      let image2 = new Image();
      image2 = Canvas2Image.convertToPNG(canvas);
      const image2Data = image2.src;
      // pdf.addImage(image2Data, 'PNG', 12, 10);

      while (heightLeft >= 0) {
        pdf.addPage();

        ctx.drawImage(headerData, 0, 0, 595, 30);
        ctx.moveTo(0, 30);
        ctx.drawImage(image2Data, 0, 30, 595, 600, 0, 30, 595, imgHeight);
        ctx.drawImage(footerData, 20, 812, 595, 30);
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

  renderFooter = (numPage) => {
    const page = numPage || '';

    return (
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
        <span style={{ float: 'right', fontSize: '18px', color: '#C0C0C0' }}>{page}</span>
      </div>
    );
  };

  renderPages = () => {
    const numItensPerPage = 3;

    return (
      <div className="containerReport">
        <Card className="cardResultado">
          <div id="divHeader">{this.renderHeader()}</div>
          <div id="divContent">
            {this.renderDadosDaVotacao()}
            {this.renderGraficos()}
          </div>
          <div id="divFooter">{this.renderFooter()}</div>
        </Card>

        <Card className="cardResultado">
          <div id="divHeader">{this.renderHeader()}</div>
          <div id="divContent">
            <ResultadoVotacaoPessoa
              codVotacao={this.props.match.params.codVotacao}
              offset={2}
              limit={4}
            />
          </div>
          <div id="divFooter">{this.renderFooter(2)}</div>
        </Card>
      </div>
    );
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

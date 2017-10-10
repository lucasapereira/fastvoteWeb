import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Row, Col, Glyphicon } from 'react-bootstrap';

import { QueryResultadoList } from './mensagensGraph';

import * as actions from './mensagensActions';

class MensagensList extends Component {
  render() {
    const renderRows = () => {
      // const list = props.list || []
      // const listMensagens = state.mensagens.listMensagens || [];
      const listMensagens = this.props.rows || [];

      console.log('EEEIA Mensagem LIst', listMensagens);
      //<td className={item.flg_enviado ? 'markAsDone' : ''}>{item.dsc_titulo}</td>
      /*
      0:
        codMensagem:4
        codPessoaJuridica:1
        datEnvio:"2017-11-15T18:22:00"
        flgEnviaapppush:false
        flgEnviado:false
        flgEnviaemail:false
        flgEnviawebpush:true
        flgErroEnvio:false
        mensagem:"Stet aperiri epicurei ex duo, te tritani sapientem eos. Verear dignissim expetendis at est. Te ferri adipisci nam, dico reprehendunt in ius. Modo putant mnesarchum id mei, dicit consul signiferumque cu qui, ne tamquam ocurreret reformidans pri. His regione scaevola inciderint cu, mea eu augue postea torquatos, ne assum melius ius. Cu equidem perfecto abhorreant ius."
        subtitulo:"subtitulo mensagem 4"
        titulo:"Teste Msg 4"
      */

      return listMensagens.map(item => {
        const styleIconCheck = color => (item.flgEnviado ? { color } : { color });
        const styleIconUncheck = color => (!item.flgEnviado ? { color } : { color });

        const check = (
          <Glyphicon
            glyph="ok"
            style={styleIconCheck('green')}
            // onClick={() => this.props.markAsSend(item)}
          />
        );
        const unCheck = (
          <Glyphicon
            glyph="remove"
            style={{ color: 'red' }}
            // onClick={() => this.props.remove(item)}
          />
        );
        return (
          <tr key={item.codMensagem}>
            <td>{item.codMensagem}</td>
            <td>{item.codPessoaJuridica}</td>
            <td>{item.titulo}</td>
            <td>{item.datEnvio}</td>
            <td>{item.subtitulo}</td>
            <td>{item.flgEnviado ? check : unCheck}</td>
            <td>
              <Glyphicon
                glyph="check"
                style={styleIconCheck('green')}
                onClick={() => this.props.markAsSend(item)}
              />
              <Glyphicon
                glyph="unchecked"
                style={styleIconUncheck('orange')}
                onClick={() => this.props.markAsUnsend(item)}
              />
              <Glyphicon
                glyph="remove"
                style={{ color: 'red' }}
                onClick={() => this.props.remove(item)}
              />
            </td>
          </tr>
        );
      });
    };

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Cod</th>
            <th>PJ</th>
            <th>Titulo</th>
            <th>Data Envio</th>
            <th>Subtitulo</th>
            <th>Enviado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    );
  }
}

const mapStateToProps = state => ({ listMensagens: state.mensagens.listMensagens });

//const mapDispatchToProps = dispatch =>
//bindActionCreators({ markAsSend, markAsUnsend, remove }, dispatch);

var conn = connect(mapStateToProps, actions)(MensagensList);
// export default connect(mapStateToProps, mapDispatchToProps)(MensagensList);
export default compose(QueryResultadoList)(conn);

/*
import { compose } from 'react-apollo';
QueryResultadoList
*/

// <MensagensList rows={rowsMessages} />
// export default compose(QueryResultadoList)(Mensagens);

// export default MensagensList;

//export default compose(QueryResultadoList)(MensagensList);

/*
import React, { Component } from 'react';
import { compose } from 'react-apollo';

import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { QueryResultadoList } from './mensagensGraph';

class MensagensList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    return (
      <Grid
        colunas={this.colunas}
        rows={this.props.rows}
        items_grid={this.state.items_grid}
        renderButtonVariosSelection={this.props.renderButtonVariosSelection}
        loading={this.props.loading}
        maskRowsUpdated={this.maskRowsUpdated}
        renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
      />
    );
  }
}

export default compose(QueryResultadoList)(MensagensList);
*/

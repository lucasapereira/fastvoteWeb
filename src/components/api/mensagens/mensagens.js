import React, { Component } from 'react';
import { compose } from 'react-apollo';

import FlatButton from 'material-ui/FlatButton';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import AlertContainer from 'react-alert';

import MensagensList from './mensagensList';
import MensagemForm from './mensagemForm';

import confirm from '../../generic/confirm';

import { GravaMensagemGraphql } from '../../../graphql/criaMensagem';
import { ApagaMensagemGraphql } from '../../../graphql/apagaMensagem';
import { ListMensagemGraphql } from '../../../graphql/allTbMensagems';

import { getStorage } from '../../generic/storage';

class Mensagens extends Component {
  constructor(props) {
    super(props);
    this.state = { showForm: false };
  }
  selectedIdsRows = [];

  setShowForm = value => {
    this.setState({
      showForm: value,
    });
  };

  setMensagensSelected = rows => {
    let arraySel = rows.map((value, key) => {
      return value.codMensagem;
    });

    this.selectedIdsRows = arraySel;
  };

  converteDataUs = data => {
    let addZero = num => {
      return num < 10 ? '0' + num : num;
    };
    const dia = addZero(data.getDate());
    const mes = addZero(data.getMonth());
    const ano = data.getFullYear();

    const hor = addZero(data.getHours());
    const min = addZero(data.getMinutes());
    //const sec = addZero(data.getSeconds());

    const dataReturn = ano + '-' + mes + '-' + dia + ' ' + hor + ':' + min + ':00';

    return dataReturn;
  };

  addMensagem = (values, e) => {
    values.codpessoajuridica = getStorage('cod_pessoa_juridica');

    // Configurando data de envio
    values.dt_envio.setHours(values.hr_envio.getHours());
    values.dt_envio.setMinutes(values.hr_envio.getMinutes());
    values.dt_envio.setSeconds(values.hr_envio.getSeconds());

    values.dathormsg = this.converteDataUs(values.dt_envio);

    this.props
      .criaMensagem({
        variables: {
          dathormsg: values.dathormsg,
          apppush: !!values.apppush,
          webpush: !!values.webpush,
          email: !!values.email,
          codpessoajuridica: values.codpessoajuridica,
          title: values.title,
          subtitle: values.subtitle,
          body: values.body,
          codusuarioarray: values.arrayUsuarios,
        },
      })
      .then(() => {
        this.props.refetch();
      })
      .catch(e => {
        this.msg.error('Erro ao realizar a operação');
        console.error(e);
      });

    this.setShowForm(false);
  };

  confirmationDelMensagem = () => {
    confirm('Você tem certeza que deseja excluir a(s) mensagem(ns) selecionada(s)?').then(
      () => {
        this.deletaMensagem();
      },
      () => {}
    );
  };

  deletaMensagem = () => {
    try {
      this.selectedIdsRows.map(async row => {
        await this.props.apaga({
          variables: {
            codmensagem: row,
            //codpessoajuridica: codPJ,
          },
        });
        this.props.refetch();
      });
    } catch (e) {
      this.msg.error('Erro ao realizar a operação');
      console.error(e);
    }
  };

  render() {
    let showScreen = () => {
      if (this.state.showForm) {
        return (
          <div>
            <Row>
              <Col xs={12}>
                <div className="pageTitle">Envio de Mensagens</div>
              </Col>
            </Row>
            <div className="divisor" />
            <Row>
              <Col xs={12} sm={3}>
                <FlatButton
                  onClick={() => this.setShowForm(false)}
                  icon={<Glyphicon glyph="chevron-left" style={{ color: 'gray' }} />}
                  label="Voltar"
                  labelStyle={{ color: 'gray' }}
                  fullWidth
                  backgroundColor="#E6E6E6"
                  hoverColor="#BDBDBD"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <MensagemForm addMensagem={this.addMensagem} />
              </Col>
            </Row>
          </div>
        );
      }
      return (
        <div>
          <Row>
            <Col xs={12}>
              <div className="pageTitle">Mensagens Cadastradas</div>
            </Col>
          </Row>
          <div className="divisor" />
          <Row>
            <Col xs={12} sm={3}>
              <FlatButton
                onClick={() => this.setShowForm(true)}
                icon={<Glyphicon glyph="plus" style={{ color: '#8AA62F' }} />}
                label="Nova Mensagem"
                labelStyle={{ color: '#8AA62F' }}
                fullWidth
              />
            </Col>
          </Row>
          <div className="divisor" />
          <Row>
            <Col xs={12}>
              <MensagensList
                delMensagem={this.confirmationDelMensagem}
                setMensagensSelected={this.setMensagensSelected}
                rows={this.props.rows}
              />
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <div className="container">
        <div className="baseContentWhite">{showScreen()}</div>
        <AlertContainer ref={a => (this.msg = a)} />
      </div>
    );
  }
}

export default compose(GravaMensagemGraphql, ApagaMensagemGraphql, ListMensagemGraphql)(Mensagens);

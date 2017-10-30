import React, { Component } from 'react';
import { compose } from 'react-apollo';

import FlatButton from 'material-ui/FlatButton';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import AlertContainer from 'react-alert';

import MensagensList from './mensagensList';
import MensagemForm from './mensagemForm';

import { GravaMensagemGraphql } from '../../../graphql/criaMensagem';
import { ListMensagemGraphql } from '../../../graphql/allTbMensagems';

import { getStorage } from '../../generic/storage';

class Mensagens extends Component {
  constructor(props) {
    super(props);
    this.state = { showForm: false };
  }

  setShowForm = value => {
    this.setState({
      showForm: value,
    });
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

    //new Date(linhas.datFimVotacao).toLocaleString()
    values.dathormsg = this.converteDataUs(values.dt_envio);

    console.log('VARIAVEIS PARA GRAVACAO em mensagem.js: ', values);

    this.props
      .criaMensagem({
        variables: {
          dathormsg: values.dathormsg,
          apppush: !!values.apppush, // values.apppush,
          webpush: !!values.webpush, // values.webpush,
          email: !!values.email, // values.email,
          codpessoajuridica: values.codpessoajuridica,
          title: values.title,
          subtitle: values.subtitle,
          body: values.body,
          codusuarioarray: values.arrayUsuarios, // values.codusuarioarray,
        },
      })
      .then(() => {
        this.props.refetch();
        console.log('deu bom');
      })
      .catch(e => {
        this.msg.error('Erro ao realizar a operação');
        console.error(e);
      });

    this.setShowForm(false);
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
            <Row>
              <Col xs={12} sm={3}>
                <FlatButton
                  onClick={() => this.setShowForm(false)}
                  icon={<Glyphicon glyph="chevron-left" style={{ color: 'white' }} />}
                  label="Voltar"
                  labelStyle={{ color: 'white' }}
                  fullWidth
                  backgroundColor="#a4c639"
                  hoverColor="#8AA62F"
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
          <Row>
            <Col xs={12} sm={3}>
              <FlatButton
                onClick={() => this.setShowForm(true)}
                icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
                label="Cadastrar mensagem"
                labelStyle={{ color: 'white' }}
                fullWidth
                backgroundColor="#a4c639"
                hoverColor="#8AA62F"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <MensagensList />
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

export default compose(ListMensagemGraphql, GravaMensagemGraphql)(Mensagens);

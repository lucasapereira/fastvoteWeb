import React, { Component } from 'react';
import { compose } from 'react-apollo';

import FlatButton from 'material-ui/FlatButton';
import { Row, Col, Glyphicon } from 'react-bootstrap';

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

  addMensagem = (values, e) => {
    console.log('VARIAVEIS PARA GRAVACAO em mensagem.js: ', values);

    values.codpessoajuridica = getStorage('cod_pessoa_juridica');

    /*
    // Configurando data de envio
    values.dt_envio.setHours(values.hr_envio.getHours());
    values.dt_envio.setMinutes(values.hr_envio.getMinutes());
    values.dt_envio.setSeconds(values.hr_envio.getSeconds());

    // new Date(linhas.datFimVotacao).toLocaleString()
    values.dathormsg = values.dt_envio.toLocaleString();

    this.props
      .criaMensagem({
        variables: {
          dathormsg: values.dathormsg,
          apppush: true, // values.apppush,
          webpush: true, // values.webpush,
          email: true, // values.email,
          codpessoajuridica: values.codpessoajuridica,
          title: values.title,
          subtitle: values.subtitle,
          body: values.body,
          codusuarioarray: [1, 2], // values.codusuarioarray,
        },
      })
      .then(() => {
        console.log('deu bom');
      })
      .catch(e => {
        console.log(e);
      });
      */

    /*
       if (!this.state.isValid) {
        this.props.authError('Crie uma nova senha mais forte.');
      } else if (this.state.password !== values.senhaNova2) {
        this.props.authError('Senhas diferentes.');
      } else {
        this.props.trocarSenha(values.senhaAntiga, values.senhaNova2);
      }
      
      =====
      values.senha = values.senha.trim();
  
      if (values.empresas) {
        this.props.signinUser(values, () => {});
      } else if (this.props.empresasAuth.length > 0) {
        values.empresas = this.props.empresasAuth[0].cod_usuario_representacao;
        this.props.signinUser(values, () => {});
      } */

    // middleware multi permite retornar um array de actions
    // middleware thunk garante que o search sera chamando quando o request retornar de forma bem sucedidfa (Promisser)

    // thunk retonra nao mais uma action, mas sim um metodo e esse metodo recebe como parametro o dispatch
    // (é quem dispara as ações)
    /*
    return dispatch => {
      const request = axios
        .post(URL, { description })
        // primeiro then faz a inclusao
  
        //.then(resp =>
        //  dispatch({
        //    type: 'MENSAGEM_ADDED',
        //    // payload: request,
        //    payload: [],
        //  })
        //)
        // Ao inves de lancar a action do tipo MENSAGEM_ADDED, somente chama o clear
        .then(resp => dispatch(clear()));
        // somente quando a resposta vier vai fazer o search
        .then(resp => dispatch(search()));
    };
    */
    /*
    return [
      /*{
        type: 'MENSAGEM_ADDED',
        // payload: request,
        payload: [],
      }, * /
      clear(),
      search(),
    ];
    */
    /*
    acontecem duas coisas
    - limpa campo do formulario (No reducerr seta vazio nos campos)
    - atualiza lista
    */
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
      </div>
    );
  }
}

export default compose(ListMensagemGraphql, GravaMensagemGraphql)(Mensagens);

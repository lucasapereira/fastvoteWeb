import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
// import { connect } from "react-redux";
import { compose } from 'react-apollo';

import AlertContainer from 'react-alert';
import { Row, Col, Button, Tooltip, Glyphicon } from 'react-bootstrap';

import FlatButton from 'material-ui/FlatButton';
import { EditorState, convertToRaw } from 'draft-js';
import Dropzone from 'react-dropzone';
import FormData from 'form-data';

import axios from 'axios';

import RichEditorExample from '../../../components/generic/rich';
import { authOptions } from '../../../components/generic/myAxios';

import CompDadosAdicionais from '../novaVotacao/compDadosAdicionais';
import CompVotantes from '../novaVotacao/compVotantes';

import { getStorage } from '../../../components/generic/storage';
import { MutationGravaVotacao } from '../../../graphql/votacao_new';

class DisparaMensagem extends Component {
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale',
  };

  constructor(props) {
    super(props);
    this.state = {
      codPessoaJuridica: getStorage('cod_pessoa_juridica'),
      activeCheckboxes: [],
      selectedRows: [],
      error_dsc_pergunta: '',
      editorState: EditorState.createEmpty(),
      accepted: [],
      rejected: [],
      filenames: [],
    };
  }

  onChange = editorState => this.setState({ editorState });

  componentDidMount() {
    // this.nameInput.focus();
  }

  handleCheck = id => {
    const found = this.state.activeCheckboxes.includes(id);

    if (found) {
      this.setState({
        activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== id),
      });
    } else {
      this.setState({
        activeCheckboxes: [...this.state.activeCheckboxes, id],
      });
    }
  };

  setUsuarioPodeVotar = selectedRows => {
    this.setState({
      selectedRows,
    });
  };

  handleAdd = () => {
    if (this.state.dscVotacao.length === 0) {
      this.msg.error('Descrição da votação é obrigatório');
    }
    if (this.state.dscPergunta.length === 0) {
      this.msg.error('Pergunta é obrigatório');
    }

    if (this.state.arrayRespostas.length < 2) {
      this.msg.error('Cadastre mais alternativas');
    }

    const arrayVotacaoUsuario = this.state.selectedRows.map(
      row => `${row.codUsuarioRepresentacao}, ${row.vlrPeso}`
    );

    const rawDraftContentState = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    this.props
      .gravaVotacao({
        variables: {
          dscresumo: rawDraftContentState,
          dscvotacao: this.state.dscVotacao,
          codpessoajuridica: this.state.codPessoaJuridica,
          dscpergunta: this.state.dscPergunta,
          votacaousuarioarray: arrayVotacaoUsuario,
          dscrespostaarray: this.state.arrayRespostas,
          dscarquivoarray: this.state.filenames,
        },
      })
      .then(() => {
        this.props.history.push('/frontend/votacao/list');
      })
      .catch(e => {
        this.msg.error('Não foi possível realizar a operação.');
      });

    /*
    limpaTela = () => {
      this.props.setSenhaTrocadaComSucesso(false);
      this.props.reset();
      this.recaptchaInstance.reset();
    };
    */

    //
  };

  renderButtonVariosSelection = selectedRows => {
    this.setUsuarioPodeVotar(selectedRows);

    const botaoSalvar = () => (
      <Row>
        <Col xs={12} sm={8} />
        <Col xs={12} sm={4}>
          <FlatButton
            onClick={this.handleAdd}
            icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
            label="Adicionar Votação"
            labelStyle={{ color: 'white' }}
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Col>
      </Row>
    );

    return <span>{botaoSalvar(selectedRows.codVotacao)}</span>;
  };

  renderButtonVariosSelectionDisabled = () => (
    <Row>
      <Col xs={12} sm={8} />
      <Col xs={12} sm={4}>
        <FlatButton
          icon={<Glyphicon glyph="plus" />}
          label="Adicionar Votação"
          fullWidth
          disabled
          backgroundColor="#E1E1E1"
        />
      </Col>
    </Row>
  );

  render() {
    let arrForm = '';
    let dropzoneRef;

    // if (this.state.codPessoaJuridica) {
    arrForm = (
      <div className="container">
        <div className="baseContentWhite">
          <div className="pageTitle">Envio de Mensagens</div>

          <Row>
            <Col xs={12}>
              <div className="pageSubTitleCadVotacao">Mensagem </div>
              <RichEditorExample onChange={this.onChange} editorState={this.state.editorState} />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="pageSubTitleCadVotacao">Filtro dados adicionais </div>
              <CompDadosAdicionais
                codPessoaJuridica={this.state.codPessoaJuridica}
                activeCheckboxes={this.state.activeCheckboxes}
                handleCheck={this.handleCheck}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="pageSubTitleCadVotacao">Seleção de Usuários </div>
              <div className="gridUsuarios">
                <CompVotantes
                  codPessoaJuridica={this.state.codPessoaJuridica}
                  activeCheckboxes={this.state.activeCheckboxes}
                  renderButtonVariosSelection={this.renderButtonVariosSelection}
                  setUsuarioPodeVotar={this.setUsuarioPodeVotar}
                  renderButtonVariosSelectionDisabled={this.renderButtonVariosSelectionDisabled}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
    // }

    return (
      <div className="container">
        <div className="baseContent">{arrForm}</div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </div>
    );
  }
}

export default compose(MutationGravaVotacao)(DisparaMensagem);

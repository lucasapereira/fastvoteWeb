import React, { Component } from 'react';
import { compose } from 'react-apollo';
import AlertContainer from 'react-alert';
import { Row, Col, Modal, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Icon from 'react-icon';

import CompPerguntaRespostas from '../novaVotacao/compPerguntaRespostas';
import CompDadosAdicionais from '../novaVotacao/compDadosAdicionais';
import CompVotantes from '../novaVotacao/compVotantes';
import { getStorage } from '../../../components/generic/storage';
import { MutationGravaVotacao } from '../../../graphql/votacao_new';

class TelaVotacaoContainer extends Component {
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
      dscVotacao: '',
      dscPergunta: '',
      dscResumo: '',
      arrayRespostas: [],
      numRespostas: 3,
      activeCheckboxes: [],
      selectedRows: [],
      error_dsc_pergunta: '',
    };
  }
  componentDidMount() {
    this.nameInput.focus();
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

  handleChange = event => {
    if (event.target.name === 'dsc_votacao') {
      this.setState({ dscVotacao: event.target.value });
    } else if (event.target.name === 'dsc_pergunta') {
      this.setState({ dscPergunta: event.target.value });
    } else if (event.target.name === 'dsc_resumo') {
      this.setState({ dscResumo: event.target.value });
    } else {
      const arrName = event.target.name.split('_');
      this.state.arrayRespostas[arrName[2] - 1] = event.target.value;
    }
  };

  altNumRespostas = x => {
    if (this.state.numRespostas >= 0) {
      // Se retira elemento, remove reposta do state array
      if (x < 0) {
        this.state.arrayRespostas.splice(this.state.numRespostas - 1, 1);
      }

      this.setState({ numRespostas: this.state.numRespostas + x });
    }
  };

  handleAdd = () => {
    if (this.state.dscVotacao.length === 0) {
      this.msg.error('Descrição da votação é obrigatório');
      return;
    }
    if (this.state.dscPergunta.length === 0) {
      this.msg.error('Pergunta é obrigatório');
      return;
    }

    if (this.state.arrayRespostas.length < 2) {
      this.msg.error('Cadastre mais alternativas');
      return;
    }

    const arrayVotacaoUsuario = this.state.selectedRows.map(
      row => `${row.codUsuarioRepresentacao}, ${row.vlrPeso}`
    );

    this.props
      .gravaVotacao({
        variables: {
          dscresumo: this.state.dscResumo,
          dscvotacao: this.state.dscVotacao,
          codpessoajuridica: this.state.codPessoaJuridica,
          dscpergunta: this.state.dscPergunta,
          votacaousuarioarray: arrayVotacaoUsuario,
          dscrespostaarray: this.state.arrayRespostas,
        },
      })
      .then(() => {
        this.props.history.push('/frontend/votacao/list');
      })
      .catch(e => {
        console.log(e);
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
            icon={<Icon glyph="plus" style={{ color: 'white' }} />}
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
          icon={<Icon glyph="plus" />}
          label="Adicionar Votação"
          fullWidth
          disabled
          backgroundColor="#E1E1E1"
        />
      </Col>
    </Row>
  );

  openModal = i => {
    this.setState({
      modalIsOpen: true,
      codModal: i,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      codModal: 0,
    });
  };

  renderModal = () => {
    let modal = '';
    let title = '';
    let content = '';

    if (this.state.codModal > 0) {
      if (this.state.codModal === 1) {
        title = 'Respostas';
        content = (
          <div>
            <h4>Cadastrando respostas</h4>
            <p>Use os campos de respostas para cadastrar as respostas da votação.</p>
            <p>Cada votação deve ter no mínimo duas opções de respostas.</p>
            <p>
              Caso queira adicionar mais opções use o botão <strong>Adicionar</strong> abaixo das
              opções.
            </p>
            <p>Caso queira excluir as opções use o botão com o X vermelho ao lado das opções.</p>
          </div>
        );
      } else if (this.state.codModal === 2) {
        title = 'Filtro de dados adicionais';
        content = (
          <div>
            <h4>Filtrando usuário que irão votar</h4>
            <p>
              Este campo é utilizado para filtrar a listagem abaixo que contém os usuários que urão
              votar.
            </p>
            <p>
              Selecione os dados adicionais que deseja para mostrar apenas os usuários agrupados por
              estas informações.
            </p>
          </div>
        );
      } else {
        title = 'Habilitação de usuários para votar';
        content = (
          <div>
            <h4>Usuário habilitados para votação</h4>
            <p>Selecione os usuários que irão participar da votação que estã sendo cadastrada.</p>
            <p>
              Caso queira filtrar os usuários pelos dados adicionais, selecione as informações
              desejadas no campo <strong>Filtro de dados adicionais</strong>.
            </p>
            <h4>Alterando peso de votação</h4>
            <p>
              Caso queira alterar o peso da votação, dê um duplo clique na célula de peso desejado e
              digite o novo valor.
            </p>
            <p>
              São aceitos apenas valores inteiros ou fracionados utilizando o ponto(.) para separar
              o fracional.
            </p>
          </div>
        );
      }

      modal = (
        <Modal bsSize="small" show={this.state.modalIsOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }

    return modal;
  };

  render() {
    let arrForm = '';

    const tooltip = (
      <Tooltip id="tooltip">
        <strong>Clique</strong>
      </Tooltip>
    );

    Icon.setDefaultFontPrefix('glyphicon');

    // if (this.state.codPessoaJuridica) {
    arrForm = (
      <div className="container">
        <div className="baseContentWhite">
          <div className="pageTitle">Cadastro de Votação</div>
          <Row>
            <Col xs={12}>
              <div className="paperCadVotacao">
                <TextField
                  ref={input => {
                    this.nameInput = input;
                  }}
                  name="dsc_votacao"
                  errorText={this.state.error_dsc_votacao}
                  floatingLabelText="Descrição da Votação"
                  onChange={this.handleChange}
                  fullWidth
                />
                <TextField
                  name="dsc_pergunta"
                  errorText={this.state.error_dsc_pergunta}
                  floatingLabelText="Pergunta da Votação"
                  onChange={this.handleChange}
                  fullWidth
                />

                <TextField
                  name="dsc_resumo"
                  hintText="Informe aqui os detalhes, questões, informações sobre essa votação."
                  multiLine
                  floatingLabelText="Resumo"
                  rows={2}
                  rowsMax={6}
                  fullWidth
                  onChange={this.handleChange}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6}>
              <div className="pageSubTitleCadVotacao">
                Respostas{' '}
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <Icon
                    glyph="question-sign"
                    style={{ color: 'blue' }}
                    onClick={() => this.openModal(1)}
                  />
                </OverlayTrigger>
              </div>
              <CompPerguntaRespostas
                numRespostas={this.state.numRespostas}
                handleChange={this.handleChange}
                altNumRespostas={this.altNumRespostas}
              />
            </Col>
            <Col xs={12} sm={6}>
              <div className="pageSubTitleCadVotacao">
                Filtro dados adicionais{' '}
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <Icon
                    glyph="question-sign"
                    style={{ color: 'blue' }}
                    onClick={() => this.openModal(2)}
                  />
                </OverlayTrigger>
              </div>
              <CompDadosAdicionais
                codPessoaJuridica={this.state.codPessoaJuridica}
                activeCheckboxes={this.state.activeCheckboxes}
                handleCheck={this.handleCheck}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="pageSubTitleCadVotacao">
                Habilitação de Usuários{' '}
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <Icon
                    glyph="question-sign"
                    style={{ color: 'blue' }}
                    onClick={() => this.openModal(3)}
                  />
                </OverlayTrigger>
              </div>
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
          {this.renderModal()};
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

export default compose(MutationGravaVotacao)(TelaVotacaoContainer);

import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import { compose } from 'react-apollo';
import CompPerguntaRespostas from '../novaVotacao/compPerguntaRespostas';
import CompDadosAdicionais from '../novaVotacao/compDadosAdicionais';
import CompVotantes from '../novaVotacao/compVotantes';
import { getStorage } from '../../../components/generic/storage';
import { MutationGravaVotacao } from '../../../graphql/votacao_new';
import AlertContainer from 'react-alert';

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
      arrayRespostas: [],
      numRespostas: 3,
      activeCheckboxes: [],
      selectedRows: [],
    };
  }

  handleCheck = (id) => {
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

  setUsuarioPodeVotar = (selectedRows) => {
    this.setState({
      selectedRows,
    });
  };

  handleChange = (event) => {
    if (event.target.name === 'dsc_votacao') {
      this.setState({ dscVotacao: event.target.value });
    } else if (event.target.name === 'dsc_pergunta') {
      this.setState({ dscPergunta: event.target.value });
    } else {
      const arrName = event.target.name.split('_');
      this.state.arrayRespostas[arrName[2] - 1] = event.target.value;
    }
  };

  altNumRespostas = (x) => {
    if (this.state.numRespostas >= 0) {
      // Se retira elemento, remove reposta do state array
      if (x < 0) {
        this.state.arrayRespostas.splice(this.state.numRespostas - 1, 1);
      }

      this.setState({ numRespostas: this.state.numRespostas + x });
    }
  };

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  handleAdd = () => {
    if (this.state.dscVotacao.length === 0) {
      this.msg.error('Descrição da votação é obrigatório');
      return;
    }
    if (this.state.dscVotacao.length === 0) {
      this.msg.error('Pergunta é obrigatório');
      return;
    }
    const arrayVotacaoUsuario = this.state.selectedRows.map((row) => {
      const arrUsuario = [];
      arrUsuario.push(`${row.codUsuario}, ${row.vlrPeso}`);
      return arrUsuario;
    });
    this.props
      .gravaVotacao({
        variables: {
          dscvotacao: this.state.dscVotacao,
          codpessoajuridica: this.state.codPessoaJuridica,
          dscpergunta: this.state.dscPergunta,
          votacaousuarioarray: arrayVotacaoUsuario,
          dscrespostaarray: this.state.arrayRespostas,
        },
      })
      .then(() => {
        this.props.history.push('/votacao/list');
      })
      .catch((e) => {
        console.log(e);
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

  renderButtonVariosSelection = (selectedRows) => {
    this.setUsuarioPodeVotar(selectedRows);

    const botaoSalvar = () =>
      (<button type="submit" className={'btn btn-primary'} onClick={this.handleAdd}>
        <i className={'fa fa-plus'} /> <i className="material-icons">add_box</i> Adicionar
      </button>);

    return (
      <span>
        {botaoSalvar(selectedRows.codVotacao)}
      </span>
    );
  };

  render() {
    let arrForm = '';

    // if (this.state.codPessoaJuridica) {
    arrForm = (
      <div>
        <CompPerguntaRespostas
          numRespostas={this.state.numRespostas}
          handleChange={this.handleChange}
          altNumRespostas={this.altNumRespostas}
        />
        <hr />
        <CompDadosAdicionais
          codPessoaJuridica={this.state.codPessoaJuridica}
          activeCheckboxes={this.state.activeCheckboxes}
          handleCheck={this.handleCheck}
        />
        <Divider />
        <CompVotantes
          codPessoaJuridica={this.state.codPessoaJuridica}
          activeCheckboxes={this.state.activeCheckboxes}
          renderButtonVariosSelection={this.renderButtonVariosSelection}
          setUsuarioPodeVotar={this.setUsuarioPodeVotar}
        />
      </div>
    );
    // }

    return (
      <div className="container">
        <div className="baseContent">
          {arrForm}
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </div>
    );
  }
}

export default compose(MutationGravaVotacao)(TelaVotacaoContainer);

import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import { compose } from 'react-apollo';

import CompAutoComplete from '../novaVotacao/compAutoComplete';
import CompPerguntaRespostas from '../novaVotacao/compPerguntaRespostas';
import CompDadosAdicionais from '../novaVotacao/compDadosAdicionais';
import CompVotantes from '../novaVotacao/compVotantes';

import { MutationGravaVotacao } from '../../../graphql/votacao_new';

class TelaVotacaoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codPessoaJuridica: null,
      dscVotacao: null,
      dscPergunta: null,
      arrayRespostas: [],
      numRespostas: 3,
      activeCheckboxes: [],
      selectedRows: [],
    };
  }

  setPessoaJuridica = (codPessoaJuridica) => {
    this.setState({
      codPessoaJuridica: codPessoaJuridica.codPessoaJuridica,
    });
  };

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

  handleAdd = () => {
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
      .then((aaa) => {
        console.log(aaa);
      })
      .catch((e) => {
        console.log('aaaasdsadas');
        console.log(e);
      });

    /*
    limpaTela = () => {
      this.props.setSenhaTrocadaComSucesso(false);
      this.props.reset();
      this.recaptchaInstance.reset();
    };
    */

    // this.props.history.push('/votacao/list');
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
          <CompAutoComplete setPessoaJuridica={this.setPessoaJuridica} />
          <hr />
          {arrForm}
        </div>
      </div>
    );
  }
}

export default compose(MutationGravaVotacao)(TelaVotacaoContainer);

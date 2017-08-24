import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class CompPerguntaRespostas extends Component {
  constructor(props) {
    super(props);
    this.state = { error_dsc_pergunta: '' };
  }

  renderRespostas = () => {
    const arrDescricao = [];

    for (let i = 1; i <= this.props.numRespostas; i++) {
      let btnDel = '';
      if (i > 2) {
        btnDel = (
          <FloatingActionButton
            mini
            secondary
            onClick={() => this.props.altNumRespostas(-1)}
            style={{ margin: 10 }}
          >
            <i className="material-icons">delete_forever</i>
          </FloatingActionButton>
        );
      }

      arrDescricao.push(
        <div>
          <TextField
            name={`dsc_resposta_${i}`}
            hintText={`Resposta ${i}`}
            onChange={this.props.handleChange}
          />
          {btnDel}
        </div>,
      );
    }

    return arrDescricao;
  };

  render() {
    return (
      <div>
        <div>
          <TextField
            name="dsc_votacao"
            errorText={this.state.error_dsc_votacao}
            hintText="Descrição da Votação"
            onChange={this.props.handleChange}
          />
        </div>
        <div>
          <TextField
            name="dsc_pergunta"
            errorText={this.state.error_dsc_pergunta}
            hintText="Pergunta da Votação"
            onChange={this.props.handleChange}
          />
        </div>
        <div>
          {this.renderRespostas()}
        </div>
        <FloatingActionButton
          mini
          onClick={() => this.props.altNumRespostas(1)}
          style={{ margin: 10 }}
        >
          <ContentAdd />
        </FloatingActionButton>
        <div />
      </div>
    );
  }
}

export default CompPerguntaRespostas;

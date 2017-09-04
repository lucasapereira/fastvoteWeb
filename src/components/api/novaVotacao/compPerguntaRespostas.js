import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import Icon from 'react-icon';

class CompPerguntaRespostas extends Component {
  renderRespostas = () => {
    Icon.setDefaultFontPrefix('glyphicon');

    const arrDescricao = [];

    for (let i = 1; i <= this.props.numRespostas; i++) {
      let btnDel = '';
      if (i > 2) {
        btnDel = (
          <FlatButton
            onClick={() => this.props.altNumRespostas(-1)}
            icon={<Icon glyph="remove" style={{ color: 'red' }} />}
          />
        );
      }

      arrDescricao.push(
        <div key={`numresposta${i}`}>
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
      <div className="divSubItemFormVotacao1">
        <div>{this.renderRespostas()}</div>
        <FlatButton
          onClick={() => this.props.altNumRespostas(1)}
          icon={<Icon glyph="plus" style={{ color: 'green' }} />}
          label="Adicionar"
          labelStyle={{ color: 'green' }}
          // style={style}
        />
      </div>
    );
  }
}

export default CompPerguntaRespostas;

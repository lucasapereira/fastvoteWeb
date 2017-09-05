import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Row, Col } from 'react-bootstrap';

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
            fullWidth
            icon={<Icon glyph="remove" style={{ color: 'red' }} />}
          />
        );
      }

      arrDescricao.push(
        <div key={`numresposta${i}`}>
          <Row>
            <Col xs={10}>
              <TextField
                name={`dsc_resposta_${i}`}
                hintText={`Resposta ${i}`}
                onChange={this.props.handleChange}
                fullWidth
              />
            </Col>
            <Col xs={2}>{btnDel}</Col>
          </Row>
        </div>,
      );
    }

    return arrDescricao;
  };

  render() {
    return (
      <div className="divSubItemFormVotacao1">
        <div>{this.renderRespostas()}</div>

        <Row>
          <Col xs={12} sm={6}>
            <FlatButton
              onClick={() => this.props.altNumRespostas(1)}
              icon={<Icon glyph="plus" style={{ color: 'green' }} />}
              label="Adicionar"
              labelStyle={{ color: 'green' }}
              fullWidth
              // style={style}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompPerguntaRespostas;

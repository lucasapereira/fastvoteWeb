import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class Forbidden extends Component {
  render() {
    return (
      <div>
        <h3>Tela não autorizada</h3>
        <div>
          <RaisedButton label="Tela Principal" containerElement={<Link to="/frontend/votacao" />} />
          <RaisedButton type="button" label="Voltar" primary onClick={this.props.history.goBack} />
        </div>
      </div>
    );
  }
}

export default Forbidden;

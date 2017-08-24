import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { confirmable } from 'react-confirm';

import Theme from './theme';

class Confirmation extends React.Component {
  render() {
    const {
      okLabel = 'Sim',
      cancelLabel = 'Não',
      title,
      confirmation,
      show,
      proceed,
      dismiss,
      cancel,
      modal,
    } = this.props;

    const actions = [
      <FlatButton label={cancelLabel} secondary onClick={cancel} />,
      <FlatButton label={okLabel} primary onClick={proceed} />,
    ];

    return (
      <Theme>
        <Dialog title={title} actions={actions} modal={modal} open={show} onRequestClose={dismiss}>
          Confirma votação em: <b>{confirmation}</b>
        </Dialog>
      </Theme>
    );
  }
}

export default confirmable(Confirmation);

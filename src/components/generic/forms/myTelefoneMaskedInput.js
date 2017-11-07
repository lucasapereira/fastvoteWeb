import React from 'react';

import TextField from 'material-ui/TextField';
import InputMask from 'react-input-mask';

export const renderTelefoneTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}>
    <InputMask {...input} {...custom} mask="+55(99)99999 9999" maskChar=" " />
  </TextField>
);

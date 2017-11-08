import React from 'react';

import TextField from 'material-ui/TextField';
import InputMask from 'react-input-mask';

export const renderCpfTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}>
    <InputMask {...input} {...custom} mask="999.999.999-99" maskChar=" " />
  </TextField>
);

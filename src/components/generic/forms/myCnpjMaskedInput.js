import React from 'react';

import TextField from 'material-ui/TextField';
import InputMask from 'react-input-mask';

export const renderCnpjTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}>
    <InputMask {...input} {...custom} mask="99.999.999/9999-99" maskChar=" " />
  </TextField>
);

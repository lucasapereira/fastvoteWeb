import React from 'react';

import TextField from 'material-ui/TextField';

export const renderFloatTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    type="number"
    step="0.01"
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

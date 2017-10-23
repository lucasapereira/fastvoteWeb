import React from 'react';

import Checkbox from 'material-ui/Checkbox';

export const renderCheckbox = props => {
  console.log('Select myCheckbox: ', props.label, props.input.value);
  return (
    <Checkbox label={props.label} checked={!!props.input.value} onCheck={props.input.onChange} />
  );
};

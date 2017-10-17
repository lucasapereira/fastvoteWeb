import React from 'react';

import Checkbox from 'material-ui/Checkbox';

export const renderCheckbox = ({ input, label }) => (
  <Checkbox label={label} checked={!!input.value} onCheck={input.onChange} />
);

import React from 'react';
import { Field } from 'redux-form';
import { renderCheckbox } from './forms/myCheckbox';

export const ListCheckbox = array => {
  return array.map(item => {
    return (
      <Field
        component={renderCheckbox}
        key={`item_${item.key}`}
        name={`item_${item.key}`}
        label={item.value}
      />
    );
  });
};

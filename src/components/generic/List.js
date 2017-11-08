import React from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';
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

export const checkBoxToScreen = (values, checkBoxValues) => {
  checkBoxValues.map(item => {
    if (item !== null) {
      const itemSplitted = item.split(';');

      values[`item_${itemSplitted[0]}`] = true;
    }
  });

  return values;
};

export const screenToGraphql = values => {
  const keyValues = _.keys(values);
  let arrReturn = [];
  keyValues.map(key => {
    if (key.indexOf('item') === 0) {
      if (key !== null) {
        const keySplitted = key.split('_');
        if (values[`${key}`] === true) {
          arrReturn.push(parseInt(keySplitted[1], 10));
        }
      }
    }
  });

  return arrReturn;
};

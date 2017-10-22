import React from 'react';
import { List } from 'material-ui/List';

export const renderList = props => {
  return (
    <List
      {...props.input}
      {...props.rest}
      valueSelected={props.input.value}
      onChange={(event, value) => props.input.onChange(value)}
      children={props.children}
    />
  );
};

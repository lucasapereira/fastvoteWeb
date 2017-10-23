import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import { renderCheckbox } from './forms/myCheckbox';

class ListArrayCheckbox extends Component {
  render() {
    const renderArrayCheckboxes = ({ arrayData }) => {
      return (
        <div>
          {arrayData.map(index => (
            <div key={index.key}>
              <Field name={`${index.key}`} label={`${index.value}`} component={renderCheckbox} />
            </div>
          ))}
        </div>
      );
    };

    return (
      <FieldArray
        name={this.props.name}
        arrayData={this.props.arrayData}
        component={renderArrayCheckboxes}
      />
    );
  }
}

export default ListArrayCheckbox;

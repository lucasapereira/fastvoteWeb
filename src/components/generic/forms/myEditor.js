/*
import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import { Editor, EditorState } from 'draft-js';

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }

  render() {
    console.log('EEIA Editor', this.props.name);
    return (
      <Editor
        placeholder="Tell a story..."
        ref={this.props.name}
        name={this.props.name}
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}

export const renderEditor = ({ input }) => {
  return <RichEditor name={input.name} />;
};
*/

import React from 'react';

import TextField from 'material-ui/TextField';

export const renderEditor = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

/*
import React from 'react';

import Checkbox from 'material-ui/Checkbox';

export const renderCheckbox = props => {
  console.log(props.input.value);
  return (
    <Checkbox label={props.label} checked={!!props.input.value} onCheck={props.input.onChange} />
  );
};
*/

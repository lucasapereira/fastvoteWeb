import React from 'react';
import { Editor, RichUtils } from 'draft-js';

class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.focus = () => this.refs.editor.focus();
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onTab = this._onTab.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.onChange(newState);
      return true;
    }
    return false;
  }
  _onTab(e) {
    const maxDepth = 4;
    this.props.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  }
  _toggleBlockType(blockType) {
    this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle));
  }
  render() {
    const { editorState } = this.props;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
        <BlockStyleControls editorState={this.props.editorState} onToggle={this.toggleBlockType} />
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={this.props.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.props.onChange}
            onTab={this.onTab}
            placeholder="Informe aqui os detalhes, questões, informações sobre essa votação."
            ref="editor"
            spellCheck
          />
        </div>
      </div>
    );
  }
}
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: 'Cabeçalho 1', style: 'header-one' },
  { label: 'Cabeçalho 2', style: 'header-two' },
  { label: 'Cabeçalho 3', style: 'header-three' },
  { label: 'Cabeçalho 4', style: 'header-four' },
  { label: 'Cabeçalho 5', style: 'header-five' },
  { label: 'Cabeçalho 6', style: 'header-six' },
  { label: 'Bloco de citação', style: 'blockquote' },
  { label: 'Lista não ordenada', style: 'unordered-list-item' },
  { label: 'Lista ordenada', style: 'ordered-list-item' },
  { label: 'Bloco de código', style: 'code-block' },
];
const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
var INLINE_STYLES = [
  { label: 'Negrito', style: 'BOLD' },
  { label: 'Itálico', style: 'ITALIC' },
  { label: 'Sublinhado', style: 'UNDERLINE' },
  { label: 'Sombreado', style: 'CODE' },
];
const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default RichEditorExample;

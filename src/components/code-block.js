import 'highlight.js/styles/github.css';
import PropTypes from 'prop-types';
import React, {Component, createRef} from 'react';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

export default class CodeBlock extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  node = createRef();

  componentDidMount() {
    hljs.highlightBlock(this.node.current);
  }

  render() {
    return <pre ref={this.node}>{this.props.children}</pre>;
  }
}

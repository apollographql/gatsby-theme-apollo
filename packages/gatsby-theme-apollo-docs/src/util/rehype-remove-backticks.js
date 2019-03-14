import is from 'hast-util-is-element';
import visit from 'unist-util-visit';

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export default function attacher() {
  return transformer;

  function transformer(tree) {
    visit(tree, 'element', visitor);
  }

  function visitor(node) {
    if (is(node, headings)) {
      visit(node, 'text', textVisitor);
    }
  }

  function textVisitor(node) {
    node.value = node.value.replace(/`/g, '');
  }
}

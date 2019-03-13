import visit from 'unist-util-visit';

const pattern = /\{% tsapibox (\S+) %\}/;
function attacher() {
  return transformer;

  function transformer(tree) {
    visit(tree, 'text', visitor);

    function visitor(node) {
      const matches = node.value.match(RegExp(pattern, 'g'));
      if (matches) {
        node.type = 'html';
        node.value = matches
          .map(match => {
            const result = match.match(pattern)[1];
            return `<div>${result}</div>`;
          })
          .join('\n');
      }
    }
  }
}

export default attacher;

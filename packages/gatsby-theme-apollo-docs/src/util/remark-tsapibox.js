import visit from 'unist-util-visit';

const pattern = /\{% tsapibox (\S+) %\}/;
function attacher() {
  return transformer;

  function transformer(tree, file) {
    visit(tree, 'text', visitor);

    function visitor(node) {
      const matches = node.value.match(RegExp(pattern, 'g'));
      if (matches) {
        matches.forEach(match => {
          const result = match.match(pattern)[1];
          console.log(result, file);
        });
      }
    }
  }
}

export default attacher;

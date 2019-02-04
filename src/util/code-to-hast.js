import detab from 'detab';
import querystring from 'querystring';
import u from 'unist-builder';

// from https://github.com/syntax-tree/mdast-util-to-hast/blob/master/lib/handlers/code.js
export default function codeToHast(h, node) {
  const value = node.value ? detab(node.value + '\n') : '';
  const lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  const codeProps = {};
  const preProps = {};

  if (lang) {
    codeProps.className = ['language-' + lang];
  }

  if (node.meta) {
    const {line} = querystring.parse(node.meta);
    preProps.dataLine = line;
  }

  return h(node.position, 'pre', preProps, [
    h(node, 'code', codeProps, [u('text', value)])
  ]);
}

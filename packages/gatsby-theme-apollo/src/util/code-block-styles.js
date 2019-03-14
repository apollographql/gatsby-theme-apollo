import colors from './colors';
import {transparentize} from 'polished';

const lines = {
  '.line-numbers .line-numbers-rows': {
    border: 0
  },
  '.line-numbers-rows > span:before': {
    color: colors.text4
  },
  '.line-highlight': {
    background: transparentize(0.9, colors.primary)
  }
};

const codeHighlighting = {
  [['.token.atrule', '.token.attr-value', '.token.keyword']]: {
    color: colors.primary
  },
  '.token.punctuation': {
    color: colors.text2
  },
  [['.token.operator', '.token.entity', '.token.url']]: {
    color: 'inherit',
    background: 'none'
  },
  [['.token.function', '.token.class-name']]: {
    color: colors.secondary
  },
  [[
    '.token.selector',
    '.token.attr-name',
    '.token.string',
    '.token.char',
    '.token.builtin',
    '.token.inserted'
  ]]: {
    color: colors.tertiary
  },
  [['.token.comment', '.token.prolog', '.token.doctype', '.token.cdata']]: {
    color: colors.text3
  }
};

const codeSelector = 'code[class*="language-"]';
const preSelector = 'pre[class*="language-"]';

export default {
  [['pre', 'code']]: {
    fontFamily: "'Source Code Pro', monospace",
    fontSize: '16px'
  },
  '*:not(pre) > code': {
    display: 'inline-block',
    verticalAlign: 'baseline',
    padding: '1px 5px',
    borderRadius: 2,
    color: colors.secondary,
    backgroundColor: colors.background2
  },
  'a > code': {
    textDecoration: 'underline',
    ':hover': {
      textDecoration: 'none'
    }
  },
  [[codeSelector, preSelector]]: {
    color: colors.text1
  },
  [[`*:not(pre) > ${codeSelector}`, preSelector]]: {
    marginBottom: '1.45rem',
    border: `1px solid ${colors.divider}`,
    borderRadius: 4,
    backgroundColor: colors.background
  },
  ...lines,
  ...codeHighlighting
};

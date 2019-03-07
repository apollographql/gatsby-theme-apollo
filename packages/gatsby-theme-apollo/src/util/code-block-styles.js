import colors from './colors';
import {transparentize} from 'polished';

const codeSelector = 'code[class*="language-"]';
const preSelector = 'pre[class*="language-"]';

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

export default {
  [['pre', 'code']]: {
    fontFamily: "'Source Code Pro', monospace",
    fontSize: 16
  },
  '*:not(pre) > code': {
    padding: '1px 4px',
    color: colors.primary,
    backgroundColor: colors.background
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
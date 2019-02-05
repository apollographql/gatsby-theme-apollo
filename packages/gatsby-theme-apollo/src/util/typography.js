import Typography from 'typography';
import colors from './colors';

const sansSerif = ['Source Sans Pro', 'Helvetica', 'sans-serif'];
export default new Typography({
  bodyColor: colors.text2,
  headerColor: colors.text1,
  scaleRatio: 2.5,
  googleFonts: [
    {
      name: 'Source Sans Pro',
      styles: ['400', '600']
    }
  ],
  headerFontFamily: sansSerif,
  bodyFontFamily: sansSerif,
  boldWeight: 600,
  overrideStyles: ({rhythm}) => ({
    html: {
      overflowY: 'auto'
    },
    form: {
      marginBottom: 0
    },
    hr: {
      backgroundColor: colors.divider
    },
    h1: {
      fontWeight: 400
    },
    'h4,p': {
      fontSize: '1.125rem'
    },
    p: {
      lineHeight: 1.5
    },
    h4: {
      marginBottom: rhythm(3 / 4)
    },
    h5: {
      marginBottom: rhythm(3 / 4),
      fontSize: '1rem'
    },
    h6: {
      fontSize: '0.875rem'
    },
    blockquote: {
      marginLeft: 0,
      padding: '12px 20px',
      borderLeft: `2px solid ${colors.primary}`
    },
    'blockquote > p': {
      fontSize: 'inherit'
    },
    ':not(pre) > code': {
      padding: '3px',
      fontFamily: "'Source Code Pro', monospace",
      color: colors.primary,
      backgroundColor: colors.background
    }
  })
});

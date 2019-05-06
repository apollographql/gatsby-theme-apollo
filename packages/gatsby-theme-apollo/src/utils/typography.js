import Typography from 'typography';
import colors from './colors';

const defaultFont = 'Source Sans Pro';
const sansSerif = [defaultFont, 'Helvetica', 'sans-serif'];

export const smallCaps = {
  letterSpacing: 2,
  textTransform: 'uppercase'
};

export default new Typography({
  bodyColor: colors.text2,
  headerColor: colors.text1,
  scaleRatio: 2.5,
  googleFonts: [
    {
      name: defaultFont,
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
    [['h1', 'h2', 'h3', 'h4', 'h6']]: {
      fontWeight: 400
    },
    [['h4', 'p', 'li']]: {
      fontSize: '1.125rem'
    },
    p: {
      lineHeight: 1.7
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
    }
  })
});

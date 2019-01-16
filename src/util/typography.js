import Typography from 'typography';
import colors from './colors';

const sansSerif = ['Source Sans Pro', 'Helvetica', 'sans-serif'];
export default new Typography({
  bodyColor: colors.textSecondary,
  headerColor: colors.text,
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
      backgroundColor: colors.grey
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
    }
  })
});

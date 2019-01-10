import Typography from 'typography';
import colors from './colors';

const sansSerif = ['Source Sans Pro', 'Helvetica', 'sans-serif'];
export default new Typography({
  bodyColor: colors.text,
  googleFonts: [
    {
      name: 'Source Sans Pro',
      styles: ['400', '600']
    }
  ],
  headerFontFamily: sansSerif,
  bodyFontFamily: sansSerif,
  overrideStyles: () => ({
    html: {
      overflowY: 'auto'
    },
    form: {
      marginBottom: 0
    }
  })
});

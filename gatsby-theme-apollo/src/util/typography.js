import Typography from 'typography';

export default new Typography({
  overrideStyles: () => ({
    html: {
      overflowY: 'auto'
    },
    form: {
      marginBottom: 0
    }
  })
});

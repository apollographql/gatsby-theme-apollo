import colors from '../util/colors';
import styled from '@emotion/styled';

export const headerHeight = 64;
export default styled.header({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  height: headerHeight,
  padding: '0 24px',
  color: colors.primary,
  backgroundColor: 'white',
  position: 'sticky',
  top: 0,
  zIndex: 1
});

import breakpoints from '../util/breakpoints';
import colors from '../util/colors';
import styled from '@emotion/styled';

export const headerHeight = 64;
const Header = styled.header({
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

export default Header;

export const MobileHeader = styled(Header)({
  display: 'none',
  [breakpoints.md]: {
    display: 'flex'
  }
});

export const DesktopHeader = styled(Header)({
  [breakpoints.md]: {
    display: 'none'
  }
});

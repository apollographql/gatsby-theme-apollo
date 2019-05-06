import styled from '@emotion/styled';
import {colors, smallCaps} from 'gatsby-theme-apollo';

export const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  maxWidth: 640,
  margin: '0 auto',
  marginBottom: 24
});

export const Button = styled.a(smallCaps, {
  padding: '12px 24px',
  border: '2px solid transparent',
  borderRadius: 1000,
  fontSize: 14,
  fontWeight: 'bold',
  color: 'white',
  textDecoration: 'none',
  backgroundColor: colors.secondary
});

export const HollowButton = styled(Button)({
  borderColor: colors.secondary,
  color: colors.secondary,
  backgroundColor: 'transparent'
});

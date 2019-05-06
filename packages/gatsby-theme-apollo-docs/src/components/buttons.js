import styled from '@emotion/styled';
import {colors} from 'gatsby-theme-apollo';

export const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  maxWidth: 640,
  margin: '0 auto 24px'
});

export const Button = styled.a({
  padding: '12px 24px',
  border: '2px solid transparent',
  borderRadius: '3em',
  fontSize: 14,
  color: 'white',
  textTransform: 'uppercase',
  textDecoration: 'none',
  letterSpacing: '0.1em',
  textIndent: '0.1em',
  backgroundColor: colors.secondary
});

export const HollowButton = styled(Button)({
  borderColor: colors.secondary,
  color: colors.secondary,
  backgroundColor: 'transparent'
});

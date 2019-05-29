import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {colors, smallCaps} from 'gatsby-theme-apollo';

export const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  maxWidth: 640,
  margin: '0 auto',
  marginBottom: 24
});

export const Button = styled(Link)(smallCaps, props => ({
  padding: '12px 24px',
  border: '2px solid',
  borderColor: props.hollow ? colors.secondary : 'transparent',
  borderRadius: 1000,
  fontSize: 14,
  fontWeight: 'bold',
  color: props.hollow ? colors.secondary : 'white',
  textDecoration: 'none',
  backgroundColor: props.hollow ? 'transparent' : colors.secondary
}));

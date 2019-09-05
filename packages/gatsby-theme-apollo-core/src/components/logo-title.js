import Logo from './logo';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  fontSize: 18
});

const StyledLogo = styled(Logo)({
  marginRight: 8,
  height: 36,
  fill: 'currentColor'
});

export default function LogoTitle(props) {
  return (
    <Container className={props.className}>
      {!props.noLogo && <StyledLogo />}
      {props.title}
    </Container>
  );
}

LogoTitle.propTypes = {
  noLogo: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string.isRequired
};

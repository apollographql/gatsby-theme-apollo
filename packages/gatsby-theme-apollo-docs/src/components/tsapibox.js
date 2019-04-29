import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div({
  color: 'red'
});

export default function TsApiBox(props) {
  console.log(props.docs);
  return <Container>{props.children}</Container>;
}

TsApiBox.propTypes = {
  docs: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

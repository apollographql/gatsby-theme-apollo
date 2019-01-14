import PropTypes from 'prop-types';
import React, {Component} from 'react';
import colors from '../../../util/colors';
import styled from '@emotion/styled';
import {MdExpandLess, MdExpandMore} from 'react-icons/md';

const headingMargin = 16;
const Container = styled.div({
  marginTop: headingMargin,
  paddingTop: headingMargin,
  paddingRight: headingMargin,
  borderTop: `1px solid ${colors.divider}`
});

const Heading = styled.h6({
  display: 'flex',
  alignItems: 'center',
  marginBottom: headingMargin,
  color: colors.text,
  textTransform: 'uppercase',
  letterSpacing: 2
});

const iconSize = 20;
const HeadingButton = styled.button({
  marginLeft: 'auto',
  padding: 0,
  border: 0,
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  svg: {
    display: 'block',
    width: iconSize,
    height: iconSize
  }
});

export default class Directory extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  state = {
    extended: false
  };

  toggle = () =>
    this.setState(prevState => ({
      extended: !prevState.extended
    }));

  render() {
    return (
      <Container>
        <Heading>
          {this.props.title}
          <HeadingButton onClick={this.toggle}>
            {this.state.extended ? <MdExpandLess /> : <MdExpandMore />}
          </HeadingButton>
        </Heading>
        {this.state.extended && this.props.children}
      </Container>
    );
  }
}

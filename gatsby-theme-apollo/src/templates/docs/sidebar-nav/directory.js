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

const Heading = styled.h6(props => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: headingMargin,
  color: props.active ? colors.primary : colors.text,
  textTransform: 'uppercase',
  letterSpacing: 2
}));

const iconSize = 20;
const HeadingButton = styled.button({
  marginLeft: 'auto',
  padding: 0,
  border: 0,
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: 'inherit',
  svg: {
    display: 'block',
    width: iconSize,
    height: iconSize,
    fill: 'currentColor'
  }
});

export default class Directory extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    active: PropTypes.bool.isRequired
  };

  state = {
    expanded: false
  };

  toggle = () =>
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));

  render() {
    return (
      <Container>
        <Heading active={this.props.active}>
          {this.props.title}
          {!this.props.active && (
            <HeadingButton onClick={this.toggle}>
              {this.state.expanded ? <MdExpandLess /> : <MdExpandMore />}
            </HeadingButton>
          )}
        </Heading>
        {(this.props.active || this.state.expanded) && this.props.children}
      </Container>
    );
  }
}

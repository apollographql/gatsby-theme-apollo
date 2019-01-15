import PropTypes from 'prop-types';
import React, {Component} from 'react';
import colors from '../../../util/colors';
import styled from '@emotion/styled';
import {MdExpandLess, MdExpandMore} from 'react-icons/md';

const Container = styled.div({
  borderTop: `1px solid ${colors.divider}`
});

const iconSize = 20;
const Heading = styled.button(props => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: 0,
  padding: 16,
  paddingLeft: 0,
  border: 0,
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: props.active ? colors.primary : colors.text,
  h6: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'inherit'
  },
  svg: {
    display: 'block',
    width: iconSize,
    height: iconSize,
    marginLeft: 'auto',
    fill: 'currentColor',
    opacity: props.active ? 0 : 1
  }
}));

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
        <Heading active={this.props.active} onClick={this.toggle}>
          <h6>{this.props.title}</h6>
          {this.state.expanded ? <MdExpandLess /> : <MdExpandMore />}
        </Heading>
        {(this.props.active || this.state.expanded) && this.props.children}
      </Container>
    );
  }
}

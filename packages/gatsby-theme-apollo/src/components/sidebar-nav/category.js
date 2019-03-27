import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../util/colors';
import store from 'store';
import styled from '@emotion/styled';
import {Link, withPrefix} from 'gatsby';
import {MdExpandLess, MdExpandMore} from 'react-icons/md';
import {css} from '@emotion/core';

const Container = styled.div({
  borderTop: `1px solid ${colors.divider}`
});

const iconSize = 20;
const headingStyles = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: 0,
  padding: 16,
  paddingLeft: 0,
  border: 0,
  color: colors.text2,
  background: 'none',
  outline: 'none',
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
    fill: 'currentColor'
  }
});

const StyledButton = styled.button(headingStyles, {
  '&.active': {
    color: colors.primary
  },
  ':not([disabled])': {
    cursor: 'pointer',
    ':hover': {
      opacity: colors.hoverOpacity
    }
  }
});

const StyledLink = styled(Link)(headingStyles, {
  textDecoration: 'none'
});

const SIDEBAR_STATE_KEY = 'sidebar';

export default class Category extends Component {
  constructor(props) {
    super(props);

    const sidebarState = store.get(SIDEBAR_STATE_KEY) || {};
    if (props.active) {
      store.set(SIDEBAR_STATE_KEY, {
        ...sidebarState,
        [this.id]: true
      });
    }

    this.state = {
      expanded: Boolean(sidebarState[this.id] || props.alwaysExpanded)
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
    children: PropTypes.node.isRequired,
    active: PropTypes.bool.isRequired,
    alwaysExpanded: PropTypes.bool
  };

  get id() {
    return withPrefix(this.props.title);
  }

  toggle = () => {
    this.setState(prevState => {
      const expanded = !prevState.expanded;
      const sidebarState = store.get(SIDEBAR_STATE_KEY) || {};
      store.set(SIDEBAR_STATE_KEY, {
        ...sidebarState,
        [this.id]: expanded
      });

      return {expanded};
    });
  };

  renderContents() {
    const Icon = this.state.expanded ? MdExpandLess : MdExpandMore;
    return (
      <Fragment>
        <h6>{this.props.title}</h6>
        <Icon
          style={{
            visibility: this.props.alwaysExpanded ? 'hidden' : 'visible'
          }}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <Container>
        {this.props.alwaysExpanded && this.props.path ? (
          <StyledLink to={this.props.path}>{this.renderContents()}</StyledLink>
        ) : (
          <StyledButton
            className={this.props.active && 'active'}
            onClick={this.props.alwaysExpanded ? null : this.toggle}
          >
            {this.renderContents()}
          </StyledButton>
        )}
        {this.state.expanded && this.props.children}
      </Container>
    );
  }
}

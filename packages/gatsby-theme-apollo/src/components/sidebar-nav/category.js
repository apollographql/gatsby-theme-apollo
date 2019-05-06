import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../utils/colors';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {MdExpandLess, MdExpandMore} from 'react-icons/md';
import {css} from '@emotion/core';
import {smallCaps} from '../../utils/typography';

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
    fontWeight: 'bold',
    ...smallCaps,
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

export default class Category extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
    expanded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func
  };

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.title);
    }
  };

  renderContents() {
    const Icon = this.props.expanded ? MdExpandLess : MdExpandMore;
    return (
      <Fragment>
        <h6>{this.props.title}</h6>
        <Icon
          style={{
            visibility: this.props.onClick ? 'visible' : 'hidden'
          }}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <Container>
        {!this.props.onClick && this.props.path ? (
          <StyledLink to={this.props.path}>{this.renderContents()}</StyledLink>
        ) : (
          <StyledButton
            className={this.props.active && 'active'}
            onClick={this.onClick}
          >
            {this.renderContents()}
          </StyledButton>
        )}
        {this.props.expanded && this.props.children}
      </Container>
    );
  }
}

import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import colors from '../../../util/colors';
import styled from '@emotion/styled';
import {SearchBox, connectStateResults} from 'react-instantsearch-dom';
import {position, size, transparentize} from 'polished';

const borderRadius = 5;
const border = `1px solid ${colors.text3}`;
const verticalAlign = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)'
};

const Hotkey = styled.div(verticalAlign, size(24), {
  border,
  borderColor: colors.text4,
  color: colors.text4,
  borderRadius,
  textAlign: 'center',
  lineHeight: 1.125,
  right: 8,
  pointerEvents: 'none'
});

const Container = styled.div({
  position: 'relative',
  '.ais-SearchBox-form': {
    color: colors.text2,
    position: 'relative'
  },
  '.ais-SearchBox-input': {
    width: '100%',
    height: 40,
    padding: 0,
    paddingLeft: 16,
    border,
    borderRadius,
    fontSize: 14,
    background: 'white',
    outline: 'none',
    ':focus': {
      borderColor: colors.text2
    }
  },
  '.ais-SearchBox-reset': {
    ...verticalAlign,
    right: 14
  },
  '.ais-SearchBox-resetIcon': {
    ...size(12),
    display: 'block',
    fill: 'currentColor'
  }
});

const Overlay = styled.div(position('fixed', 0), {
  backgroundColor: transparentize(0.5, colors.text2)
});

const boxShadowColor = transparentize(0.9, 'black');
const Results = styled.div({
  width: 600,
  maxHeight: 600,
  marginTop: 14,
  borderRadius,
  boxShadow: `${boxShadowColor} 0 2px 12px`,
  backgroundColor: 'white',
  overflow: 'auto',
  position: 'absolute',
  top: '100%',
  left: 0
});

function preventDefault(event) {
  event.preventDefault();
}

class SearchInput extends Component {
  static propTypes = {
    searchResults: PropTypes.object
  };

  state = {
    focused: false
  };

  onFocus = () => this.setState({focused: true});

  onBlur = () => this.setState({focused: false});

  render() {
    const {query = ''} = this.props.searchResults || {};
    const resultsShown = this.state.focused && query.trim();
    return (
      <Fragment>
        <Container>
          {resultsShown && <Overlay />}
          <SearchBox
            focusShortcuts={[191]}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            submit={null}
          />
          {!this.state.focused && !query && <Hotkey>/</Hotkey>}
          {resultsShown && (
            <Results>
              {this.props.searchResults.hits.map(hit => (
                <div key={hit.objectID} onMouseDown={preventDefault}>
                  {hit.name}
                </div>
              ))}
            </Results>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default connectStateResults(SearchInput);

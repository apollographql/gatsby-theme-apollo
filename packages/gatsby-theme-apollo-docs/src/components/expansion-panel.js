import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from '@emotion/styled';
import {MdCheck, MdExpandLess, MdExpandMore} from 'react-icons/md';
import {colors} from 'gatsby-theme-apollo';
import {size, transparentize} from 'polished';

const Container = styled.div({
  marginBottom: '1.45rem',
  borderLeft: `2px solid ${colors.primary}`
});

const InnerContainer = styled.div({
  border: `1px solid ${colors.text4}`,
  borderLeft: 0,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4
});

const iconMargin = 8;
const horizontalPadding = 16;
const StyledButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: `12px ${horizontalPadding}px`,
  border: 0,
  fontSize: 16,
  color: colors.primary,
  lineHeight: 'calc(5/3)',
  textAlign: 'left',
  background: 'none',
  outline: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: transparentize(0.95, 'black')
  },
  ':active': {
    backgroundColor: transparentize(0.9, 'black')
  },
  svg: {
    marginRight: iconMargin
  }
});

const iconSize = 24;
const Content = styled.div({
  padding: `8px ${horizontalPadding + iconSize + iconMargin}px`,
  color: colors.text1,
  p: {
    fontSize: '1rem'
  }
});

const lineItemNumberSize = 24;
const lineItemNumberOffset = lineItemNumberSize / 2;
const ListItemNumber = styled.div(size(lineItemNumberSize), {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${colors.primary}`,
  borderRadius: '50%',
  fontSize: 14,
  color: colors.primary,
  textAlign: 'center',
  backgroundColor: 'white',
  position: 'absolute',
  top: 0,
  left: lineItemNumberSize / -2
});

const StyledList = styled.ul({
  marginLeft: lineItemNumberOffset,
  borderLeft: `1px solid ${colors.primary}`,
  listStyle: 'none'
});

const StyledListItem = styled.li({
  marginBottom: 0,
  paddingLeft: lineItemNumberOffset + 8,
  fontSize: '1rem',
  lineHeight: 1.5,
  position: 'relative',
  ':not(:last-child)': {
    marginBottom: 28
  }
});

function ExpansionPanelListItem(props) {
  return (
    <StyledListItem>
      <ListItemNumber>{props.number}</ListItemNumber>
      {props.children}
    </StyledListItem>
  );
}

ExpansionPanelListItem.propTypes = {
  number: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

const items = [
  'Numbered list item',
  'Numbered list item',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat velit at metus lacinia congue. Morbi vel aliquam eros. Nulla finibus, leo non tristique viverra, nulla dui mattis nunc, aliquam aliquet est tellus non eros. Maecenas posuere ut nisl id imperdiet. Cras lacinia, libero gravida tincidunt convallis, justo lacus convallis justo, sed blandit justo augue sed tellus. Suspendisse sit amet ante sit amet neque vestibulum viverra.'
];

export default function ExpansionPanel() {
  const [expanded, setExpanded] = useState(false);
  const Icon = expanded ? MdExpandLess : MdExpandMore;
  return (
    <Container>
      <InnerContainer>
        <StyledButton onClick={() => setExpanded(!expanded)}>
          <Icon size={iconSize} />
          Panel Item
        </StyledButton>
        {expanded && (
          <Content>
            <p>List Title or Main Text</p>
            <StyledList>
              {items.map((item, index) => {
                const number = index + 1;
                return (
                  <ExpansionPanelListItem
                    key={index}
                    number={number.toString()}
                  >
                    {item}
                  </ExpansionPanelListItem>
                );
              })}
              <ExpansionPanelListItem number={<MdCheck size={16} />}>
                You&apos;re done!
              </ExpansionPanelListItem>
            </StyledList>
          </Content>
        )}
      </InnerContainer>
    </Container>
  );
}

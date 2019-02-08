import styled from '@emotion/styled';
import {breakpointMd} from '../util/breakpoints';

export default styled.div({
  padding: '40px 64px',
  [breakpointMd]: {
    padding: '32px 48px'
  }
});

import React from 'react';
import client from './src/client';
import {ApolloProvider} from '@apollo/react-common';

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({element}) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);

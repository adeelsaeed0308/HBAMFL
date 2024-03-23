import React from 'react';
import Spinner from '../Spinner';
import { Container } from './styles';

const FullPageLoad = ({ fillWidth }) => {
  return (
    <Container fillWidth={fillWidth}>
      <Spinner />
    </Container>
  );
};

export default FullPageLoad;

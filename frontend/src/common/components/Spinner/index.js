import React from 'react';
import { SpinnerContainer } from './styles';

const Spinner = ({ color, inline }) => {
  return (
    <SpinnerContainer color={color} inline={inline}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </SpinnerContainer>
  );
};

export default Spinner;

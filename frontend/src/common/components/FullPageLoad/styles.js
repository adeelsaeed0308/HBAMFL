import styled, { css } from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ fillWidth }) =>
    fillWidth &&
    css`
      width: 100%;
      height: 100%;
    `}
`;

export { Container };

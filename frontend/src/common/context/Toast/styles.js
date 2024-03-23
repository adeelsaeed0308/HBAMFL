import styled, { css } from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 1rem;
  font-size: 0.8rem;
  left: 50%;
  z-index: 10000002;
  width: 250px;
  text-align: center;
  padding: 0.3rem;
  background: ${({ color }) => color};
  transform: translate(-50%);
  color: white;
  font-weight: bold;
  transition: all 200ms ease-in;
  top: -10rem;
  opacity: 0;
  ${({ toast }) =>
    toast &&
    css`
      top: 1rem;
      opacity: 1;
    `}
  border-radius:5px;
`;

export { Container };

import styled from "styled-components";

const Container = styled.div``;

const Column = styled.div`
  width: 250px;
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    width: 100%;
  }
`;

export { Container, Column };

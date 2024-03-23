import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
  width: 80%;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  max-width: 1000px;
  grid-gap: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    width: 100%;
  }
  > div:last-child {
    align-self: end;
  }
`;

export { Container };

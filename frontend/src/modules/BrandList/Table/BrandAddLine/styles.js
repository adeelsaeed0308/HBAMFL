import { OverflowContainer } from "common";
import styled from "styled-components";

const Container = styled(OverflowContainer)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  padding: 0.3rem 1rem;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
`;

export { Container };

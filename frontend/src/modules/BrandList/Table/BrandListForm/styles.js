import { OverflowContainer } from "common";
import styled from "styled-components";

const Container = styled(OverflowContainer)`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
  height: 80vh;
`;

const InactiveContainer = styled.div`
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.danger};
  font-size: 0.75rem;
  & p {
    margin-bottom: 0.2rem;
  }
`;

export { Container, InactiveContainer };

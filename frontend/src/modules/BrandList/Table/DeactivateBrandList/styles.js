import { OverflowContainer } from "common";
import styled from "styled-components";

const Container = styled(OverflowContainer)`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
`;

export { Container };

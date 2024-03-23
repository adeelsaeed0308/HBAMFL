import { darken } from "polished";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
`;

const VendorField = styled.div`
  background: ${({ theme }) => darken(0.1, theme.colors.lightGrey)};
  padding: 0.2rem;
  text-align: center;
  border-radius: 1rem;
  margin-bottom: 0.2rem;
  transition: all 200ms ease;
  color: white;
  font-weight: bold;
  :hover {
    background: ${({ theme }) => theme.colors.lightestGrey};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export { Container, VendorField };

import { Card } from "common";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  grid-gap: 1rem;
`;

const Splitter = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
`;

const BrandRequestDetails = styled(Card)`
  & h3 {
    font-size: 2rem;
  }
  display: grid;
  grid-template-columns: 2fr auto 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
    & * {
      text-align: center;
    }
  }
`;

const KPIContainer = styled.div`
  > * {
    padding: 0.5rem;
    text-align: center;
  }
  & h4 {
    font-size: 1.2rem;
  }
  & h2 {
    font-size: 2rem;
  }
  & p {
    font-size: 0.9rem;
  }
`;

const DividerLine = styled.div`
  width: 1px;
  height: 100px;
  background: ${({ theme }) => theme.colors.black};
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    height: 1px;
    width: 100px;
  }
`;

export { Container, BrandRequestDetails, KPIContainer, DividerLine, Splitter };

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

const VendorDetails = styled(Card)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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
  }
  & p {
    font-size: 0.75rem;
  }
`;

const ExportModalComponent = styled.div`
  width: 400px;
  height: 200px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0.5rem;
  justify-items: center;
  & h3 {
    font-size: 1.5rem;
  }
`;

export { Container, VendorDetails, KPIContainer, Splitter, ExportModalComponent };

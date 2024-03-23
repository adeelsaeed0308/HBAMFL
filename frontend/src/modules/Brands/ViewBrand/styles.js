import { Card } from "common";
import { lighten } from "polished";
import styled, { css } from "styled-components";

const Container = styled.div`
  padding: 1rem;
  width: 80%;
  height: 100%;
  max-width: 1000px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    width: 100%;
  }
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-gap: 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto 1fr 1fr;
    grid-template-areas:
      "name kpi"
      "name kpi"
      "name kpi"
      "name kpi";
  }
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-areas:
      "name"
      "kpi"
      "kpi"
      "kpi";
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr auto 1fr;
  }
`;

const BrandName = styled(Card)`
  grid-area: name;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`;

const BrandKpi = styled(Card)`
  cursor: pointer;
  & h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  & p {
    font-size: 0.8rem;
    text-align: center;
  }
`;

const ExportContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
`;

const ExportTabs = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.2rem;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ExportTab = styled.div`
  width: 6rem;
  cursor: pointer;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.lightestGrey};
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  ${({ theme, isActive }) =>
    !isActive &&
    css`
      background: ${lighten(0.07, theme.colors.lightestGrey)};
      font-weight: normal;
    `}
`;

const ExportActions = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightestGrey};
  padding: 1rem;
`;

const FormWrapperHorizontal = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  align-items: center;
  & form {
    display: flex;
    @media (max-width: ${({ theme }) => theme.breakpointXs}) {
      flex-direction: column;
      align-items: center;
    }
    > * {
      margin-right: 1rem;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    align-items: center;
    justify-items: center;
  }
`;

const EmailModalContainer = styled.div`
  width: 100%;
  padding: 1rem;
  > div {
    justify-items: center;
  }
`;

export {
  BrandKpi,
  BrandName,
  Container,
  DetailsContainer,
  EmailModalContainer,
  ExportActions,
  ExportContainer,
  ExportTab,
  ExportTabs,
  FormWrapperHorizontal,
};

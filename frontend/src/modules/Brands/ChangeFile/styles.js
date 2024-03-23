import { lighten } from 'polished';
import styled, { css } from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 2rem;
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1.5rem;
  grid-template-areas:
    'name kpi kpi'
    'name kpi kpi';
  > div {
    transition: all 200ms ease;
    background: ${({ theme }) => theme.colors.lightestGrey};
    :hover {
      background: ${({ theme }) => lighten(0.05, theme.colors.lightestGrey)};
    }
    padding: 1rem;
    border-radius: 5px;
  }
`;

const BrandName = styled.div`
  grid-area: name;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`;

const BrandKpi = styled.div`
  & h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  & p {
    font-size: 0.8rem;
  }
`;

const ExportContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
`;

const ExportTabs = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
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
    > * {
      margin-right: 1rem;
    }
  }
`;

export {
  Container,
  DetailsContainer,
  BrandName,
  BrandKpi,
  FormWrapperHorizontal,
  ExportContainer,
  ExportTabs,
  ExportTab,
  ExportActions,
};

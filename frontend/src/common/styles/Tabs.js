import { lighten } from "polished";
import styled, { css } from "styled-components";

const Tabs = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  height: 100%;
  > div {
    margin-right: 0.2rem;
  }
`;

const Tab = styled.div`
  min-width: 6rem;
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
  & sup {
    margin-left: 0.2rem;
    font-size: 0.7rem;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 100px;
    padding: 0.2rem;
    color: white;
    font-weight: bold;
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const TabContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

const TabDisplay = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.lightestGrey};
`;

export { Tabs, Tab, TabContainer, TabDisplay };

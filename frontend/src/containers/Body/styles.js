import { Menu } from "@carbon/icons-react";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - ${({ theme }) => theme.headerHeight});
  margin-top: ${({ theme }) => theme.headerHeight};
  display: grid;
  grid-template-columns: auto 1fr;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
  }
`;

const SideNav = styled.div`
  width: ${({ isOpen }) => (isOpen ? "15rem" : "3rem")};
  background: ${({ theme, isThemeFlipped }) =>
    theme.colors[isThemeFlipped ? "white" : "lightestGrey"]};
  height: 100%;
  transition: all 150ms ease-out;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  overflow: auto;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    display: none;
  }
  display: grid;
  grid-template-rows: auto 1fr;
`;

const ContentContainer = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  background: ${({ theme, isThemeFlipped }) =>
    isThemeFlipped && theme.colors.lightestGrey};
`;

const MenuIcon = styled(Menu)`
  cursor: pointer;
  width: 100%;
  height: 30px;
`;

const SideNavLink = styled.div`
  padding: 0.7rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  transition: all 100ms ease;
  ${({ isActive, theme }) =>
    isActive &&
    css`
      font-weight: bold;
      border-left: 5px solid ${theme.colors.primary};
      color: ${theme.colors.primary};
    `}
`;

const SideNavGroupHeader = styled.div`
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.lightGrey};
  text-align: center;
  font-weight: bold;
  color: white;
`;

const SideNavGroup = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.lightGrey};
  margin-bottom: 1rem;
`;

export {
  Container,
  SideNav,
  MenuIcon,
  SideNavGroup,
  ContentContainer,
  SideNavGroupHeader,
  SideNavLink,
};

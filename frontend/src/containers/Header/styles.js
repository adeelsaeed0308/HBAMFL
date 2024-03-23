import { Menu } from "@carbon/icons-react";
import { addPointerToIcon } from "common";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: ${({ theme }) => theme.headerHeight};
  position: fixed;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.secondary};
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 0.5rem;
  overflow: auto;
  z-index: 100001;
`;

const RightSide = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  grid-gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    display: none;
  }
`;

const Info = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const Burger = styled(addPointerToIcon(Menu))`
  width: 32px;
  height: 32px;
  & path {
    fill: ${({ theme }) => theme.colors.primary};
  }
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    display: none;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.headerHeight};
  transition: all 500ms ease-out;
  left: ${({ isActive }) => (isActive ? "0" : "-1000px")};
  height: calc(100vh - ${({ theme }) => theme.headerHeight});
  width: 100vw;
  background: white;
  z-index: 100000;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 1rem;
  }
  overflow: auto;
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    display: none;
  }
`;

export { Container, RightSide, Info, Burger, MobileNav };

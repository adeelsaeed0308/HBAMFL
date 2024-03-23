import { Branding, GridContainer, sideNav, useLoginContext } from "common";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Container,
  ContentContainer,
  MenuIcon,
  SideNav,
  SideNavGroup,
  SideNavGroupHeader,
  SideNavLink,
} from "./styles";

const ThemeFlipContext = React.createContext({ setIsThemeFlipped: () => {} });

const ActiveNavLink = ({ to, children }) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <SideNavLink isActive={isActive}>{children}</SideNavLink>
    )}
  </NavLink>
);

const buildSideNav = (option, level = 1) => {
  if (option.show) {
    if (option.link) {
      return (
        <ActiveNavLink key={option.link} to={option.link}>
          {option.name}
        </ActiveNavLink>
      );
    }
    return (
      <SideNavGroup key={option.name + level}>
        <SideNavGroupHeader>{option.name}</SideNavGroupHeader>
        {option.sub.map((opt) => buildSideNav(opt, level + 1))}
      </SideNavGroup>
    );
  }
  return null;
};

const SideNavOptions = ({ responsive }) => {
  const loginContext = useLoginContext();

  const sideNavWithUser = sideNav(loginContext);

  return (
    <GridContainer fullWidth noBg columns={responsive ? 5 : 1}>
      {sideNavWithUser.map((option) => buildSideNav(option))}
    </GridContainer>
  );
};

const Body = ({ children }) => {
  const loginContext = useLoginContext();
  const bodyRef = useRef();
  const location = useLocation();
  const [isThemeFlipped, setIsThemeFlipped] = useState();

  useEffect(() => {
    if (bodyRef.current && bodyRef.current.scrollTop) {
      bodyRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  if (!loginContext?.currentUser) {
    return <>
      {children}
    </>
  }
  return (
    <Container>
      <SideNav isOpen={isSidenavOpen} isThemeFlipped={isThemeFlipped}>
        <MenuIcon onClick={() => setIsSidenavOpen((prev) => !prev)} />
        {isSidenavOpen && (
          <>
            <SideNavOptions />
            <Branding />
          </>
        )}
        </SideNav>
      <ContentContainer ref={bodyRef} isThemeFlipped={isThemeFlipped}>
        <ThemeFlipContext.Provider value={{ setIsThemeFlipped }}>
          {children}
        </ThemeFlipContext.Provider>
      </ContentContainer>
    </Container>
  );
};

const useThemeFlip = () => {
  const { setIsThemeFlipped } = useContext(ThemeFlipContext);
  useEffect(() => {
    setIsThemeFlipped(true);
    return () => setIsThemeFlipped(false);
  }, [setIsThemeFlipped]);
};

export { Body as default, SideNavOptions, useThemeFlip };

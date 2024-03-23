import {
  Branding,
  Button,
  Logo,
  routing,
  useAxios,
  useLoginContext,
} from "common";
import { useToast } from "common/context/Toast";
import { SideNavOptions } from "containers/Body";
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Burger, Container, Info, MobileNav, RightSide } from "./styles";

const Header = () => {
  const { currentUser, clearCurrentUser } = useLoginContext();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { alertSuccess } = useToast();
  const navigate = useNavigate();
  const { callAxios, loading } = useAxios({
    onComplete: () => {
      alertSuccess("You are now Logged Out");
      clearCurrentUser();
      navigate(routing.root);
    },
  });
  const toggleMobileNav = () => setShowMobileNav((prev) => !prev);
  const info = <Info>Hello, {currentUser?.name || currentUser?.email}</Info>;
  const logout = (
    <Button
      loading={loading}
      secondary
      onClick={() => {
        callAxios({ method: "POST", url: "/auth/logout" });
      }}
    >
      Logout
    </Button>
  );
  if (!currentUser) {
    return null;
  }
  return (
    <Fragment>
      <MobileNav isActive={showMobileNav} onClick={toggleMobileNav}>
        {info}
        <SideNavOptions />
        <div>{logout}</div>
        <Branding />
      </MobileNav>
      <Container>
        <Link to={routing.home}>
          <Logo />
        </Link>
        <Burger onClick={toggleMobileNav} />
        <RightSide>
          {info}
          {logout}
        </RightSide>
      </Container>
    </Fragment>
  );
};

export default Header;

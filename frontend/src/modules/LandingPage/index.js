import { SideNavOptions } from "containers";
import React from "react";
import { Container } from "./styles";

const LandingPage = () => {
  return (
    <Container>
      <h1>Welcome Back</h1>
      <h3>Select an Option</h3>
      <SideNavOptions responsive />
    </Container>
  );
};

export default LandingPage;

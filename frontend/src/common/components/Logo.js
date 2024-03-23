import { kandaLogo, logo } from "common/assets";
import { isKanda } from "common/functions";
import React from "react";
import styled from "styled-components";

const Img = styled.img`
  height: 50px;
`;

const KandaImg = styled.img`
  width: auto;
  height: 55px;
`;

const Logo = () => {
  return isKanda() ? (
    <KandaImg src={kandaLogo} alt="Kanda" />
  ) : (
    <Img src={logo} alt="Work Portal" />
  );
};

export default Logo;

import { View, ViewFilled } from "@carbon/icons-react";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ isArea, fillWidth }) => !isArea && !fillWidth && "225px"};
  min-height: 55px;
  height: ${({ isArea }) => isArea && "300px"};
  transition: all 200ms ease;
  :focus-within {
    border-color: ${({ theme, hasError }) =>
      theme.colors[hasError ? "danger" : "primary"]};
  }
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0.2rem;
  position: relative;
  .quill {
    display: grid;
    grid-template-rows: auto 1fr;
    background: white;
  }
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, hasError }) => hasError && theme.colors.danger};
  margin-bottom: 0.2rem;
`;

const IconButton = styled.span`
  font-weight: bold;
  color: red;
  cursor: pointer;
`;

export { Container, Label, IconButton };

import { CloseOutline } from "@carbon/icons-react";
import { addPointerToIcon } from "common/functions";
import { lighten } from "polished";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 40px;
  max-width: 250px;
  transition: all 200ms ease;
  display: grid;
  grid-template-rows: ${({ hasError }) => (hasError ? "1fr auto" : "1fr")};
  grid-gap: 0.2rem;
`;

const InputContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ hasFile }) => (hasFile ? "space-between" : "center")};
  padding: 0 1rem;
  color: white;
  font-weight: bold;
  transition: all 200ms ease;
  :hover {
    background: ${({ theme }) => lighten(0.1, theme.colors.primary)};
  }
  > input {
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const Remove = styled(addPointerToIcon(CloseOutline))`
  position: absolute;
  right: 1rem;
  z-index: 2;
  & path {
    fill: white;
  }
`;

export { Container, Remove, InputContainer };

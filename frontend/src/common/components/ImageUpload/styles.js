import { TrashCan } from "@carbon/icons-react";
import { addPointerToIcon } from "common/functions";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 175px;
  transition: all 200ms ease;
  :focus-within {
    border-color: ${({ theme, hasError }) =>
      theme.colors[hasError ? "danger" : "primary"]};
  }
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0.2rem;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, hasError }) => hasError && theme.colors.danger};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1rem;
`;

const Image = styled.div`
  transition: all 250ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  background: url(${({ image }) => image}) no-repeat center center;
  width: 400px;
  height: 150px;
  border: 1px dashed
    ${({ theme, isDragging }) =>
      theme.colors[isDragging ? "primary" : "secondary"]};
  ${({ isDragging, theme }) =>
    isDragging &&
    css`
      background: ${theme.colors.lightestGrey};
    `}
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    width: 200px;
  }
`;

const Remove = addPointerToIcon(TrashCan);

export { Container, Label, Image, Remove };

import { Calendar } from "@carbon/icons-react";
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
`;

const CalendarIcon = styled(Calendar)``;

const Input = styled.div`
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  background: white;
  padding: 0 0.3rem;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  height: 38px;
  font-size: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  ${({ theme, allBorders }) =>
    allBorders &&
    css`
      border: 1px solid ${theme.colors.lighterGrey};
      border-radius: 4px;
      padding: 0 1rem;
    `}
  ${({ theme, disabled }) =>
    disabled &&
    css`
      background: ${theme.colors.lightestGrey};
    `}
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export { Container, Input, CalendarIcon };

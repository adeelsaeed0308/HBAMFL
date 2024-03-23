import { lighten } from "polished";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: ${({ fit }) => !fit && "100&"};
  max-width: 225px;
  height: 60px;
  border-radius: 5px;
  transition: all 200ms ease;
  :focus-within {
    border-color: ${({ theme, hasError }) =>
      theme.colors[hasError ? "danger" : "primary"]};
  }
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 0.2rem;
  align-items: center;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, hasError, checked }) =>
    !checked ? theme.colors.lightGrey : hasError && theme.colors.danger};
  transition: all 300ms ease;
`;

const ToggleContainer = styled.div`
  width: 3rem;
  height: 1.5rem;
  background: ${({ theme }) => theme.colors.lightestGrey};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  position: relative;
  border-radius: 20px;
  cursor: pointer;
  transition: all 200ms ease-out;
  ${({ isChecked, theme }) =>
    isChecked &&
    css`
      border-color: ${theme.colors.primary};
      background: ${lighten(0.45, theme.colors.primary)};
    `}
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 0.2rem;
  left: 0.25rem;
  width: 1rem;
  height: 1rem;
  background: ${({ theme }) => theme.colors.lightGrey};
  border-radius: 100px;
  transition: all 200ms ease-out;
  ${({ isChecked, theme }) =>
    isChecked &&
    css`
      top: 0.2rem;
      left: 1.7rem;
      background: ${theme.colors.primary};
    `}
`;

export { Container, Label, ToggleContainer, ToggleButton };

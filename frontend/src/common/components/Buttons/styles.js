import { lighten } from "polished";
import styled, { css } from "styled-components";

const ButtonStyle = styled.button`
  width: ${({ fit }) => (fit ? "fit-content" : "100%")};
  min-width: ${({ fit }) => !fit && "100px"};
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  outline: none;
  transition: all 200ms ease;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  & * {
    color: white;
    fill: white;
  }
  font-weight: bold;
  padding: 0 1rem;
  border-radius: 5px;
  :hover {
    background: ${({ theme }) => lighten(0.1, theme.colors.primary)};
  }
  ${({ format, theme }) =>
    format === "secondary"
      ? css`
          background: none;
          color: ${theme.colors.primary};
          & * {
            color: ${theme.colors.primary};
            fill: ${theme.colors.primary};
          }
          border: 1px solid ${theme.colors.primary};
          :hover {
            background: none;
            color: ${lighten(0.1, theme.colors.primary)};
            border: 1px solid ${lighten(0.1, theme.colors.primary)};
          }
        `
      : format === "danger" &&
        css`
          background: ${({ theme }) => theme.colors.danger};
          :hover {
            background: ${({ theme }) => lighten(0.1, theme.colors.danger)};
          }
        `}
  :disabled {
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.lightGrey};
  }
`;

const ExportButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
`;

const ButtonOptions = styled.div`
  position: absolute;
  width: 100%;
  bottom: -5px;
  left: 0;
  background: white;
  transform: translate(0, 100%);
  > * {
    padding: 0.3rem;
    :not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.lightestGrey};
    }
    :hover {
      background: ${({ theme }) => theme.colors.lightestGrey};
    }
    cursor: pointer;
  }
  z-index: 1000;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

export { ButtonStyle, ExportButtonContainer, ButtonOptions };

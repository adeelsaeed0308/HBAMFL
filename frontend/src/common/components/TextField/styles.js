import { View, ViewFilled } from "@carbon/icons-react";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ isArea, fillWidth }) => !isArea && !fillWidth && "225px"};
  min-height: ${({ isArea }) => isArea ? "300px" : "55px"};
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

const PasswordInputContainer = styled.div`
  background: white;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.2rem;
  align-items: center;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  background: white;
  padding: 0 0.3rem;

  height: 38px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  ${({ theme, allBorders }) =>
    allBorders &&
    css`
      border: 1px solid ${theme.colors.lighterGrey};
      border-radius: 4px;
      padding: 0 1rem;
    `}
  :disabled {
    background: ${({ theme }) => theme.colors.lightestGrey};
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Area = styled.textarea`
  height: 250px;
  resize: none;
  padding: 0.4rem;
  border-color: ${({ theme }) => theme.colors.lightGrey};
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, hasError }) => hasError && theme.colors.danger};
  margin-bottom: 0.2rem;
`;

const Eye = styled(View)`
  width: 20px;
  height: 20px;
  margin-right: 0.2rem;
  cursor: pointer;
  & path {
    fill: ${({ theme }) => theme.colors.secondary};
  }
  & circle {
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;

const EyeShowing = styled(ViewFilled)`
  width: 20px;
  height: 20px;
  margin-right: 0.2rem;
  cursor: pointer;
  & path {
    fill: ${({ theme }) => theme.colors.secondary};
  }
  & circle {
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;

const Suggestions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: translate(0, 100%);
  z-index: 1000;
  max-height: 6rem;
  overflow: auto;
  background: ${({ theme }) => theme.colors.white};
  > div {
    padding: 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    :hover {
      background: ${({ theme }) => theme.colors.lightestGrey};
    }
  }
`;

export {
  Container,
  Input,
  Label,
  PasswordInputContainer,
  Eye,
  EyeShowing,
  Area,
  Suggestions,
};

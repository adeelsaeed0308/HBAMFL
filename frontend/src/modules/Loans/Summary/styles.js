import { lighten } from "polished";
import { HiRefresh } from "react-icons/hi";
import styled, { css } from "styled-components";

const Card = styled.div`
  padding: 1rem;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  height: fit-content;
  transition: all 300ms ease;
  :hover {
    background: ${({ theme }) => theme.colors.lightestGrey};
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  ${({ theme, color }) =>
    color &&
    css`
      background: ${color};
      :hover {
        background: ${lighten(0.2, color)};
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
      & * {
        color: ${theme.colors.white};
      }
    `}
`;

const Refresh = styled(HiRefresh)`
  width: 1.5rem;
  height: 1.5rem;
  & path {
    fill: ${({ theme }) => theme.colors.primary};
  }
  cursor: pointer;
`;

export { Card, Refresh };

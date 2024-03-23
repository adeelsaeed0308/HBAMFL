import styled, { css } from "styled-components";

const Header = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1rem 0;
  > h3 {
    margin-right: 1rem;
  }
  & * {
    transition: all 100ms ease;
  }
  ${({ show }) =>
    show &&
    css`
      & svg {
        transform: rotate(-180deg);
      }
    `}
`;

export { Header };

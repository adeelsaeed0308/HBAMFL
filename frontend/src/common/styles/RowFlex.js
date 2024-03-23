import styled, { css } from "styled-components";

const RowFlex = styled.div`
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  align-items: ${({ column }) => !column && "center"};
  gap: 1rem;
  justify-content: ${({ extend, center }) =>
    extend ? "space-between" : center && "center"};
  margin: ${({ margin }) => margin && "0.5rem 0"};
  ${({ responsive, theme }) =>
    responsive &&
    css`
      @media (max-width: ${theme.breakpointXs}) {
        flex-direction: column;
        align-items: start;
      }
    `}
`;

export default RowFlex;

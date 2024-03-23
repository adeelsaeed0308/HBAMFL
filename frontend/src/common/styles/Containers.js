import styled from "styled-components";

const GridContainer = styled.div`
  background: ${({ theme, noBg }) => !noBg && theme.colors.white};
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 1}, 1fr);
  grid-template-rows: repeat(${({ rows }) => rows || 1}, 1fr);
  grid-gap: 1rem;
  padding: ${({ noPadding }) => !noPadding && "1rem"};
  border-radius: 4px;
  width: ${({ fullWidth }) => fullWidth && "100%"};
  @media (max-width: ${({ theme }) => theme.breakpointS}) {
    grid-template-columns: repeat(
      ${({ columns }) => Math.min(columns || 1, 2)},
      1fr
    );
  }
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
  }
`;

export { GridContainer };

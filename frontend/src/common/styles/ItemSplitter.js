import styled from "styled-components";

const ItemSplitter = styled.div`
  width: ${({ autoWidth }) => !autoWidth && "100%"};
  display: grid;
  grid-template-columns: ${({ autoWidth, split = 2 }) =>
    autoWidth ? "auto auto 1fr" : `repeat(${split}, 1fr)`};
  grid-gap: 0.3rem;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
    grid-template-rows: ${({ split }) => `repeat(${split}, 1fr)`};
  }
`;

export default ItemSplitter;

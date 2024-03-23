import styled from "styled-components";

const GridItem = styled.div`
  padding: 1.5rem;
  border-radius: 4px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 0.5rem;
  background: ${({ theme }) => theme.colors.white};
  & h4 {
    margin-bottom: 1rem;
    font-size: 18px;
  }
  > div {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.lightGrey};
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      color: ${({ theme }) => theme.colors.lightGrey};
    }
  }
`;

export { GridItem };

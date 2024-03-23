import { OverflowContainer, RowFlex } from "common";
import styled from "styled-components";

const Container = styled(OverflowContainer)`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
`;

const CategoryColumn = styled.div`
  min-width: 150px;
  max-width: 250px;
  height: 100%;
  background: ${({ theme }) => theme.colors.lightestGrey};
  display: grid;
  grid-template-rows: auto 1fr auto;
  border: 1px solid ${({ theme }) => theme.colors.black};
`;

const CategoryColumnHeader = styled(RowFlex)`
  padding: 1rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.lightGrey};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
`;

const BrandRow = styled(RowFlex)`
  padding: 0.4rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  :hover {
    background: ${({ theme }) => theme.colors.lighterGrey};
  }
`;

const BrandName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Columns = styled(RowFlex)`
  font-size: 0.8rem;
  height: 100%;
`;

export {
  Container,
  CategoryColumn,
  CategoryColumnHeader,
  BrandRow,
  Columns,
  BrandName,
};

import { FaSearch } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 1rem;
  padding: 1rem;
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  height: fit-content;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    grid-template-columns: 1fr;
  }
`;

const SearchInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  align-items: center;
  padding-left: 0.8rem;
`;

const SearchIcon = styled(FaSearch)`
  & path {
    fill: ${({ theme }) => theme.colors.lightGrey};
  }
`;

const Search = styled.input`
  padding: 0.8rem;
  border: none;
  outline: none;
`;

const LoanItemContainer = styled.div`
  padding: 1.5rem;
  border-radius: 4px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  background: ${({ theme }) => theme.colors.white};
  & h4 {
    margin-bottom: 2rem;
    font-size: 18px;
  }
  > div {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.lightGrey};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    > div {
      color: ${({ theme }) => theme.colors.lightGrey};
    }
  }
`;

export {
  Container,
  Options,
  SearchInputContainer,
  SearchIcon,
  Search,
  LoanItemContainer,
};

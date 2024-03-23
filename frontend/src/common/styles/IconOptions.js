import styled from "styled-components";

const IconOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  & a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & svg {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.lightestGrey};
    padding: 0.3rem;
    height: 1.7rem;
    width: 1.7rem;
    border-radius: 100px;
    & path {
      stroke: ${({ theme }) => theme.colors.lightGrey};
    }
  }
`;

export default IconOptions;

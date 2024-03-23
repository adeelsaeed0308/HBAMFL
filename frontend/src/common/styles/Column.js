import styled from "styled-components";

const Column = styled.div`
  width: 250px;
  padding: 0.5rem;
  > * {
    margin-bottom: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    width: 100%;
  }
`;

export default Column;

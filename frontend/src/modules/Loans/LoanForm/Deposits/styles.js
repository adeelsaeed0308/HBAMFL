import styled from "styled-components";

const Container = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.lightGrey};
  padding: 0.5rem;
  & h4 {
    margin-bottom: 1rem;
  }
`;

export { Container };

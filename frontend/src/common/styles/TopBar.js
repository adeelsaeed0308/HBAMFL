import styled from "styled-components";

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: ${({ marginBottom }) => marginBottom && "2rem"};
`;

export default TopBar;

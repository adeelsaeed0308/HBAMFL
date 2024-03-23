import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  height: fit-content;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 4px;
  display: grid;
  grid-template-rows: 1fr auto auto;
  grid-gap: 2rem;
`;

export { Card };

import styled from "styled-components";

const DeleteModal = styled.div`
  text-align: center;
  width: 300px;
  height: 200px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0.5rem;
  justify-items: center;
  & h3 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export { DeleteModal };

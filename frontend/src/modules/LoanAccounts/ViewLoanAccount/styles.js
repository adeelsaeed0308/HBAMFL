import styled from "styled-components";

const PaymentCard = styled.div`
  padding: 1rem;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  height: fit-content;
`;

export { PaymentCard };

import styled from "styled-components";

const InputLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, hasError }) => hasError && theme.colors.danger};
  margin-bottom: 0.2rem;
`;

const ErrorText = styled.div`
  font-size: 0.5rem;
  color: ${({ theme }) => theme.colors.danger};
`;

export { InputLabel, ErrorText };

import styled, { css } from 'styled-components';

const FormWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 0.5rem;
  ${({ alignCenter }) =>
    alignCenter &&
    css`
      justify-items: center;
    `}
  > form {
    width: 100%;
    > * {
      margin-bottom: 1rem;
    }
  }
  > div > * {
    margin-right: 1rem;
  }
  padding: 1rem 0;
`;

export default FormWrapper;

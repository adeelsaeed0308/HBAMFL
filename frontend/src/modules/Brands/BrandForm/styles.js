import { Form as FormikForm } from "formik";
import styled from "styled-components";

const Form = styled(FormikForm)`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    flex-direction: column;
  }
`;

export { Form };

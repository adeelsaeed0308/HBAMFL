import styled from "styled-components";

const DividerHorizontal = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.lighterGrey};
  margin: ${({ pad }) => pad && "1rem 0"};
`;

export { DividerHorizontal };

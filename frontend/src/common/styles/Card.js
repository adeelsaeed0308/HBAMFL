import { lighten } from "polished";
import styled from "styled-components";

const Card = styled.div`
  transition: all 200ms ease;
  background: ${({ theme }) => theme.colors.lightestGrey};
  :hover {
    background: ${({ theme }) => lighten(0.05, theme.colors.lightestGrey)};
  }
  padding: 1rem;
  border-radius: 5px;
`;

export default Card;

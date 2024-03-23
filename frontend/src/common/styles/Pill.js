import { lighten } from "polished";
import styled from "styled-components";

const Pill = styled.div`
  cursor: pointer;
  width: fit-content;
  padding: ${({ small }) => (small ? "0.2rem" : "0.5rem")} 1rem;
  background: ${({ theme, color }) =>
    lighten(0.45, theme.colors[color || "lightGrey"])};
  color: ${({ theme, color }) => theme.colors[color || "lightGrey"]} !important;
  border: 1px solid currentColor;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ small }) => small && "0.7rem"};
  font-weight: bold;
`;

export default Pill;

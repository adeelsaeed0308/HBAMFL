import { darken } from "polished";
import { HiOutlineTrash } from "react-icons/hi";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import styled from "styled-components";

const DeleteIcon = styled(HiOutlineTrash)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  & path {
    stroke: ${({ theme }) => theme.colors.danger};
  }
  :hover {
    & path {
      stroke: ${({ theme }) => darken(0.1, theme.colors.danger)};
    }
  }
`;

const PinIcon = styled(BsPinAngle)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const PinnedIcon = styled(BsPinFill)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

export { DeleteIcon, PinIcon, PinnedIcon };

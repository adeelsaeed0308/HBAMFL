import { HiOutlineViewGrid, HiViewList } from "react-icons/hi";
import styled from "styled-components";

const [Grid, List] = [HiOutlineViewGrid, HiViewList].map(
  (Icon) => styled(Icon)`
    cursor: pointer;
    transition: all 500ms ease;
    & path {
      fill: ${({ theme, isSelected }) =>
        theme.colors[isSelected ? "primary" : "lightGrey"]};
      stroke: ${({ theme, isSelected }) =>
        theme.colors[isSelected ? "primary" : "lightGrey"]};
    }
  `
);

export { Grid, List };

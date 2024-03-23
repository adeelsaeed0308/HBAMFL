import {
  CaretLeft,
  CaretRight,
  ChevronLeft,
  ChevronRight,
} from "@carbon/icons-react";
import { lighten } from "polished";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  font-size: 0.65rem;
  padding: 0.2rem;
`;

const factory = (Component = ChevronLeft) => styled(Component)`
  cursor: pointer;
  :hover {
    color: ${({ theme }) => lighten(0.3, theme.colors.secondary)};
    & path,
    & circle {
      fill: ${({ theme }) => lighten(0.3, theme.colors.secondary)};
    }
  }
`;

const Left = factory(ChevronLeft);

const AllLeft = factory(CaretLeft);

const Right = factory(ChevronRight);

const AllRight = factory(CaretRight);

const PageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Page = factory(
  styled.div`
    padding: 0.2rem;
    font-weight: ${({ isActive }) => isActive && "bold"};
  `
);

const PageInfo = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 0.4rem;
  align-items: center;
`;

export {
  Container,
  Left,
  AllLeft,
  PageContainer,
  Page,
  AllRight,
  Right,
  PageInfo,
};

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

const AttachmentsContainer = styled(Card)`
  & h3 {
    text-align: center;
    margin-bottom: 1rem;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${({ theme }) => theme.breakpointXs}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.5rem;
  }
`;

const AttachmentContainer = styled.div`
  width: 100%;
  height: 100px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  :nth-child(odd) {
    background: ${({ theme }) => lighten(0.15, theme.colors.lightGrey)};
  }
`;

const ImageContainer = styled.div`
  display: grid;
  justify-items: center;
  grid-template-rows: 1fr auto;
  grid-gap: 0.3rem;
`;

export { AttachmentContainer, AttachmentsContainer, ImageContainer };

import { CloseOutline } from "@carbon/icons-react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100002;
  background: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div`
  position: absolute;
  background: white;
  top: 50%;
  left: 50%;
  min-width: 70%;
  min-height: 80%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  grid-gap: 0.5rem;
  overflow: auto;
  z-index: 100003;
`;

const Close = styled(CloseOutline)`
  cursor: pointer;
  justify-self: end;
`;

export { Container, ModalContainer, Close };

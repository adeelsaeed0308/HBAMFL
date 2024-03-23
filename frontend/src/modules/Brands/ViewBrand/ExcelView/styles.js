import styled from "styled-components";
import { Link } from "common/styles";
import { Button } from 'common'

const Container = styled.div`
  width: 90vw;
  height: 90vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const Viewer = styled.iframe`
  width: 100%;
  height: 100%;
`;

const DownloadButton = styled(Button)`
  margin: 0 20px;
`
const DownloadLink = styled(Link)`
  margin: 0 20px;
  text-align: center;
  text-decoration: underline;
`;

export { Container, Viewer, DownloadButton, DownloadLink, ButtonsWrapper };

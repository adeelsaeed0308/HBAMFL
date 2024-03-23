import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

const Branding = () => (
  <Container>
    <p style={{ fontSize: 12 }}>Powered By:</p>
    <a href="https://wiederand.co" target="_blank" rel="noreferrer">
      <img
        src="https://i.ibb.co/ZgYYQNH/Wieder-PNG.png"
        alt="Wieder &amp; Co"
        style={{ height: 44 }}
      />
    </a>
  </Container>
);

export default Branding;

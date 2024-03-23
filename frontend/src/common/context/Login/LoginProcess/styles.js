import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary};
`;

const LoginBox = styled.div`
  width: 80%;
  max-height: 500px;
  /* border: 2px solid ${({ theme }) => theme.colors.secondary}; */
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  max-width: 350px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  box-shadow: rgba(255, 255, 255, 0.3) 0px 4px 12px;
  & h3 {
    text-align: center;
    margin-bottom: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    width: 97%;
  }
`;

const LogoSection = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { Container, LoginBox, LogoSection };

import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: ${({ fillWidth }) => !fillWidth && "225px"};
  height: ${({ isMulti, height }) => (isMulti ? "auto" : height || "60px")};
  border-radius: 5px;
  transition: all 200ms ease;
  :focus-within {
    border-color: ${({ theme, hasError }) =>
      theme.colors[hasError ? "danger" : "primary"]};
  }
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0.2rem;
  & .react-select-2-listbox {
    z-index: 10000;
  }
`;

export { Container };

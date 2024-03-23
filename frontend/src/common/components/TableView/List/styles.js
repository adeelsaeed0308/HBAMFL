import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  & th {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
    position: sticky;
    top: 0;
    z-index: 4;
  }
  & th,
  & td {
    padding: 0.5rem;
    text-align: left;
    font-size: 0.8rem;
  }

  & td {
    border-bottom: 1px solid
      ${({ theme, darker }) => theme.colors[darker ? "white" : "lightestGrey"]};
  }

  & tbody tr {
    :nth-child(even) {
      & td {
        background: ${({ theme, darker }) =>
          theme.colors[darker ? "white" : "lightestGrey"]};
      }
    }
  }

  & tbody tr.selected {
    td {
      background: #d3d3d3
    }
  }
`;

export { Table };

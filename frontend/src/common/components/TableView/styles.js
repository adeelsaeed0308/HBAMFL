import { OverflowContainer } from "common/styles";
import { FaCheck, FaEnvelope, FaRegClipboard } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-rows: ${({ dataGrid }) =>
    dataGrid ? "auto 1fr" : "auto auto 1fr auto"};
  grid-gap: 1rem;
  position: relative;
`;

const TableContainer = styled(OverflowContainer)`
  height: ${({ height }) => height};
  @media (max-width: ${({ theme }) => theme.breakpointXs}) {
    height: ${({ height }) => `${+height.replace("vh", "") - 9}vh`};
  }
`;

const BulkActionCheckBox = styled.div`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

const BulkAction = ({ checked, onClick }) => {
  return (
    <BulkActionCheckBox onClick={onClick}>
      {checked && <FaCheck />}
    </BulkActionCheckBox>
  );
};

const generateIcon = (Icon) => styled(Icon)`
  cursor: pointer;
  & path {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const iconObject = {
  email: generateIcon(FaEnvelope),
  details: generateIcon(FaRegClipboard),
};

export {
  BulkAction,
  BulkActionCheckBox,
  Container,
  iconObject,
  TableContainer,
};

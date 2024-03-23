import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { Header } from "./styles";

const CollapsibleHeader = ({ header, show, setShow }) => {
  return (
    <Header show={show} onClick={() => setShow((prev) => !prev)}>
      <h3>{header}</h3>
      <FaChevronDown />
    </Header>
  );
};

export default CollapsibleHeader;

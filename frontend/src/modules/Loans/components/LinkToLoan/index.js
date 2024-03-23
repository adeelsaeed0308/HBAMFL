import {
  generateLinkWithParams,
  linkPlaceholders,
  Pill,
  routing,
} from "common";
import React from "react";
import { Link } from "react-router-dom";

const LinkToLoan = ({ loan }) => {
  if (loan) {
    return (
      <Link
        to={generateLinkWithParams(routing.loans.view, {
          [linkPlaceholders.loanId]: loan.id,
        })}
        target="_blank"
      >
        <Pill>{loan.loanNumber}</Pill>
      </Link>
    );
  }
  return null;
};

export default LinkToLoan;

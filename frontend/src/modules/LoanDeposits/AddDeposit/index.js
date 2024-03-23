import { useThemeFlip } from "containers";
import React from "react";
import { useSearchParams } from "react-router-dom";
import DepositForm from "../DepositForm";
import formikSchema from "./formikSchema";

const AddLoanDeposit = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loan");
  useThemeFlip();
  return <DepositForm formikSchema={formikSchema(loanId)} loanId={loanId} />;
};

export default AddLoanDeposit;

import { useThemeFlip } from "containers";
import React from "react";
import LoanAccountForm from "../LoanAccountForm";
import formikSchema from "./formikSchema";

const AddLoanAccount = () => {
  useThemeFlip();
  return <LoanAccountForm formikSchema={formikSchema} />;
};

export default AddLoanAccount;

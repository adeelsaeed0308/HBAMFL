import { useThemeFlip } from "containers";
import React from "react";
import LoanForm from "../LoanForm";
import formikSchema from "./formikSchema";

const AddLoan = () => {
  useThemeFlip();
  return <LoanForm formikSchema={formikSchema} />;
};

export default AddLoan;

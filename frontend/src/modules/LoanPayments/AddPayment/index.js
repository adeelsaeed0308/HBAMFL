import { useThemeFlip } from "containers";
import React from "react";
import { useSearchParams } from "react-router-dom";
import PaymentForm from "../PaymentForm";
import formikSchema from "./formikSchema";

const AddLoanPayment = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loan");
  useThemeFlip();
  return <PaymentForm formikSchema={formikSchema(loanId)} loanId={loanId} />;
};

export default AddLoanPayment;

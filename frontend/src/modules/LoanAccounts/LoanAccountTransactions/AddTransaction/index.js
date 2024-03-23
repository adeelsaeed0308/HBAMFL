import { useThemeFlip } from "containers";
import React from "react";
import { useParams } from "react-router-dom";
import TransactionForm from "../TransactionForm";
import formikSchema from "./formikSchema";

const AddTransaction = () => {
  const { loanAccountId } = useParams();
  useThemeFlip();
  return <TransactionForm formikSchema={formikSchema(loanAccountId)} />;
};

export default AddTransaction;

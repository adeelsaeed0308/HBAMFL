import React from "react";
import { useSearchParams } from "react-router-dom";
import DueDateForm from "../DueDateForm";
import initialValues from "./initialValues";

const AddDueDate = () => {
  const [searchParams] = useSearchParams();
  const loanAccount = searchParams.get("loanAccount");
  return (
    <DueDateForm
      initialValues={initialValues(loanAccount)}
      loanAccount={loanAccount}
    />
  );
};

export default AddDueDate;

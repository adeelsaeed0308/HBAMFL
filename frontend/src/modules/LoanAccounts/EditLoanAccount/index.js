import { FullPageLoad, useAxios } from "common";
import { useThemeFlip } from "containers";
import React from "react";
import { useParams } from "react-router-dom";
import LoanAccountForm from "../LoanAccountForm";
import validationSchema from "../validationSchema";

const EditLoanAccount = () => {
  const { loanAccountId } = useParams();
  useThemeFlip();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/loanAccounts/${loanAccountId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <LoanAccountForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoanAccount;

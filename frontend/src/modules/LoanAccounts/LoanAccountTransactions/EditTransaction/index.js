import { FullPageLoad, useAxios } from "common";
import { useThemeFlip } from "containers";
import React from "react";
import { useParams } from "react-router-dom";
import TransactionForm from "../TransactionForm";
import validationSchema from "../validationSchema";

const EditLoanAccountTransaction = () => {
  const { loanAccountTransactionId } = useParams();
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/loanAccountTransactions/${loanAccountTransactionId}`,
    },
  });
  useThemeFlip();
  if (response) {
    return (
      <TransactionForm
        formikSchema={{ initialValues: response.data, validationSchema }}
        isEdit
      />
    );
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoanAccountTransaction;

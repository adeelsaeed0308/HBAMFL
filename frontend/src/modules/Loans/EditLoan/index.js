import { FullPageLoad, useAxios } from "common";
import { useThemeFlip } from "containers";
import React from "react";
import { useParams } from "react-router-dom";
import LoanForm from "../LoanForm";
import validationSchema from "../validationSchema";

const EditLoan = () => {
  const { loanId } = useParams();
  useThemeFlip();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/loans/${loanId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <LoanForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoan;

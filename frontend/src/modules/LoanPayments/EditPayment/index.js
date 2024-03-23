import { FullPageLoad, useAxios } from "common";
import { useThemeFlip } from "containers";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PaymentForm from "../PaymentForm";
import validationSchema from "../validationSchema";

const EditLoanPayment = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loan");
  const { loanPaymentId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/loanPayments/${loanPaymentId}` },
  });
  useThemeFlip();
  if (response) {
    return (
      <PaymentForm
        formikSchema={{ initialValues: response.data, validationSchema }}
        isEdit
        loanId={loanId}
      />
    );
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoanPayment;

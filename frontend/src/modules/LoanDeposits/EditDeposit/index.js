import { FullPageLoad, useAxios } from "common";
import { useThemeFlip } from "containers";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DepositForm from "../DepositForm";
import validationSchema from "../validationSchema";

const EditLoanDeposit = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loan");
  const { loanDepositId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/loanDeposits/${loanDepositId}` },
  });
  useThemeFlip();
  if (response) {
    return (
      <DepositForm
        formikSchema={{ initialValues: response.data, validationSchema }}
        isEdit
        loanId={loanId}
      />
    );
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoanDeposit;

import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DueDateForm from "../DueDateForm";

const EditLoanAccountDueDate = () => {
  const [searchParams] = useSearchParams();
  const loanAccount = searchParams.get("loanAccount");
  const { loanAccountDueDateId } = useParams();
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/loanAccountDueDates/${loanAccountDueDateId}`,
    },
  });
  if (response) {
    return (
      <DueDateForm
        initialValues={response.data}
        isEdit
        loanAccount={loanAccount}
      />
    );
  }
  return <FullPageLoad fillWidth />;
};

export default EditLoanAccountDueDate;

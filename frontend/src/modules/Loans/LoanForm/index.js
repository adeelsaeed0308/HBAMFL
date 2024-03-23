import {
  generateLinkWithParams,
  linkPlaceholders,
  PageContainer,
  routing,
  RowFlex,
  useAxios,
  useGoBack,
} from "common";
import { Formik } from "formik";
import { useTotalAvailable } from "modules/LoanLandingPage";
import { dissoc } from "ramda";
import React, { useState } from "react";
import Form from "./Form";

const LoanForm = ({ isEdit, formikSchema }) => {
  const onComplete = useGoBack();
  const [sos, setSOs] = useState([]);
  const { refetchLoanAmounts } = useTotalAvailable();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Loan ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: (r) => {
      refetchLoanAmounts();
      onComplete(
        generateLinkWithParams(routing.loans.view, {
          [linkPlaceholders.loanId]: r.data.id,
        })
      );
    },
  });

  return (
    <PageContainer>
      <RowFlex>
        <h1>{isEdit ? "Edit" : "Add"} Loan</h1>{" "}
      </RowFlex>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/loans${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", { ...data, sos }),
          });
        }}
      >
        <Form isEdit={isEdit} loading={loading} sos={sos} setSOs={setSOs} />
      </Formik>
    </PageContainer>
  );
};

export default LoanForm;

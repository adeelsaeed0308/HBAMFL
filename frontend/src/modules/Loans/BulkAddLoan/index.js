import {
  Button,
  Column,
  FileUpload,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  PageContainer,
  useAxios,
  useGoBack,
} from "common";
import { useThemeFlip } from "containers";
import { Field, Formik } from "formik";
import { useTotalAvailable } from "modules/LoanLandingPage";
import React from "react";
import formikSchema from "./formikSchema";

const BulkAddLoan = () => {
  const onComplete = useGoBack();
  const { refetchLoanAmounts } = useTotalAvailable();
  useThemeFlip();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Loans Added Successfully!`,
    onComplete: () => {
      refetchLoanAmounts();
      onComplete();
    },
  });
  return (
    <PageContainer>
      <h1>Bulk Add Loans</h1>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          const data = new FormData();
          data.append("file", values.file);
          callAxios({
            method: "POST",
            url: "/loans/import",
            data,
            headers: {
              "Content-Type": "blob",
            },
          });
        }}
      >
        <FormWrapper>
          <Column>
            <Field
              name="file"
              accept={[".xls", ".xlsx"]}
              component={FileUpload}
            />
            <div>
              Please upload an Excel file with 5 columns: PO, Brand, Amount, BillTotal, Date (MM/DD/YYYY)
            </div>
          </Column>
          <ItemSplitter autoWidth>
            <Button secondary onClick={onComplete}>
              Cancel
            </Button>
            <FormikSubmit loading={loading}>Upload</FormikSubmit>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default BulkAddLoan;

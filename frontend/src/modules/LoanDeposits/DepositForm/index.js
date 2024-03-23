import {
  Button,
  DatePicker,
  DividerHorizontal,
  FormikSubmit,
  GridContainer,
  ItemSplitter,
  loanPOPrefix,
  loanSOPrefix,
  PageContainer,
  TextField,
  useAxios,
  useGoBack,
} from "common";
import { Field, Formik } from "formik";
import { useTotalAvailable } from "modules/LoanLandingPage";
import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "./styles";

const DepositForm = ({ formikSchema, isEdit, loanId }) => {
  const { loanDepositId } = useParams();
  const onComplete = useGoBack();
  const { refetchLoanAmounts } = useTotalAvailable();
  // const loans = useLoans();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Deposit Added Successfully!`,
    onComplete: () => {
      onComplete();
      refetchLoanAmounts();
    },
  });
  return (
    <PageContainer>
      <h1>{isEdit ? "Edit" : "Add"} Loan Deposit</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/loanDeposits${isEdit ? `/${loanDepositId}` : ""}`,
            data,
          });
        }}
      >
        {({ values, handleChange }) => {
          if (values.SO?.substring(0, 3) !== loanSOPrefix) {
            handleChange({
              target: { name: "SO", value: loanSOPrefix + values.SO },
            });
          }
          if (values.PO?.substring(0, 3) !== loanPOPrefix) {
            handleChange({
              target: { name: "PO", value: loanPOPrefix + values.PO },
            });
          }
          return (
            <Card>
              <GridContainer columns={2} noPadding>
                {/* <Field
                  name="loan"
                  component={Dropdown}
                  label="Loan"
                  required
                  fillWidth
                  disabled={!!loanId}
                  allBorders
                  options={loans}
                /> */}
                <Field
                  name="date"
                  component={DatePicker}
                  label="Date"
                  required
                  type="number"
                  fillWidth
                  allBorders
                />
                <Field
                  name="SO"
                  component={TextField}
                  label="SO"
                  required
                  fillWidth
                  allBorders
                />
                <Field
                  name="PO"
                  component={TextField}
                  label="PO"
                  required
                  fillWidth
                  allBorders
                />
                <Field
                  name="depositTotal"
                  component={TextField}
                  label="Deposit Total"
                  required
                  fillWidth
                  allBorders
                  type="number"
                />
              </GridContainer>
              <DividerHorizontal />
              <ItemSplitter autoWidth style={{ justifySelf: "end" }}>
                <Button secondary onClick={onComplete}>
                  Cancel
                </Button>
                <FormikSubmit loading={loading}>Save Changes</FormikSubmit>
              </ItemSplitter>
            </Card>
          );
        }}
      </Formik>
    </PageContainer>
  );
};

export default DepositForm;

import {
  Button,
  DatePicker,
  DividerHorizontal,
  Dropdown,
  FormikSubmit,
  generateLinkWithParams,
  ItemSplitter,
  linkPlaceholders,
  loanSOPrefix,
  PageContainer,
  routing,
  RowFlex,
  TextField,
  useAxios,
  useGoBack,
  useLoans,
} from "common";
import { Field, Formik } from "formik";
import React from "react";
import { useParams } from "react-router-dom";
import { Card, FormContainer } from "./styles";

const PaymentForm = ({ formikSchema, isEdit, loanId }) => {
  const { loanPaymentId } = useParams();
  const onComplete = useGoBack();
  const loans = useLoans();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Payment Updated Successfully!`,
    onComplete: (d) =>
      onComplete(
        generateLinkWithParams(routing.loans.view, {
          [linkPlaceholders.loanId]: d.data.loan,
        })
      ),
  });
  return (
    <PageContainer>
      <h1>{isEdit ? "Edit" : "Add"} Loan Payment</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/loanPayments${isEdit ? `/${loanPaymentId}` : ""}`,
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
          return (
            <Card>
              <FormContainer>
                <Field
                  name="loan"
                  component={Dropdown}
                  label="Loan"
                  required
                  fillWidth
                  disabled={!!loanId}
                  allBorders
                  options={loans}
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
                  name="date"
                  component={DatePicker}
                  label="Date"
                  required
                  type="number"
                  fillWidth
                  allBorders
                />
                <RowFlex>
                  <Field
                    name="amount"
                    component={TextField}
                    label="Amount"
                    required
                    fillWidth
                    allBorders
                    type="number"
                  />
                  {/* <Field
                    name="paid"
                    component={Toggle}
                    label="Paid?"
                    fillWidth
                    allBorders
                  /> */}
                </RowFlex>
                <Field
                  name="interestPaid"
                  component={TextField}
                  label="Interest Paid"
                  fillWidth
                  allBorders
                  type="number"
                />
              </FormContainer>
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

export default PaymentForm;

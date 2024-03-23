import {
  Button,
  DividerHorizontal,
  FormikSubmit,
  ItemSplitter,
  PageContainer,
  TextField,
  useAxios,
  useGoBack,
} from "common";
import { Field, Formik } from "formik";
import { dissoc } from "ramda";
import React from "react";
import { Card, FormContainer } from "./styles";

const LoanAccountForm = ({ isEdit, formikSchema }) => {
  const goBack = useGoBack();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Loan Account ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: goBack,
  });
  return (
    <PageContainer>
      <h1>{isEdit ? "Edit" : "Add"} Loan Account</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/loanAccounts${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", data),
          });
        }}
      >
        <Card>
          <FormContainer>
            <Field
              name="name"
              component={TextField}
              label="Name"
              required
              fillWidth
              allBorders
            />
            <Field
              name="creditLimit"
              component={TextField}
              label="Credit Limit"
              required
              type="number"
              fillWidth
              allBorders
            />
            <Field
              name="amount"
              component={TextField}
              label="Amount"
              required
              type="number"
              fillWidth
              allBorders
            />
            <Field
              name="dailyRate"
              component={TextField}
              label="Daily Rate"
              type="number"
              fillWidth
              allBorders
            />
          </FormContainer>
          <DividerHorizontal />
          <ItemSplitter autoWidth style={{ justifySelf: "end" }}>
            <Button secondary onClick={goBack}>
              Cancel
            </Button>
            <FormikSubmit loading={loading}>Save Changes</FormikSubmit>
          </ItemSplitter>
        </Card>
      </Formik>
    </PageContainer>
  );
};

export default LoanAccountForm;

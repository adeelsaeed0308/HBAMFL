import {
  Button,
  DatePicker,
  DividerHorizontal,
  FormikSubmit,
  FullPageLoad,
  GridContainer,
  ItemSplitter,
  PageContainer,
  TextField,
  useAxios,
  useGoBack,
} from "common";
import { Field, Formik } from "formik";
import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "./styles";

const TransactionForm = ({ formikSchema, isEdit }) => {
  const { loanAccountId, loanAccountTransactionId } = useParams();
  const onComplete = useGoBack();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/loanAccounts/${loanAccountId}` },
  });
  const { callAxios, loading } = useAxios({
    alertSuccess: `Transaction Added Successfully!`,
    onComplete,
  });

  if (response) {
    const account = response.data;
    return (
      <PageContainer>
        <h1>
          {isEdit ? "Edit" : "Add"} Transaction for Account {account.name}
        </h1>
        <Formik
          {...formikSchema}
          onSubmit={(data) => {
            callAxios({
              method: isEdit ? "PUT" : "POST",
              url: `/loanAccountTransactions${
                isEdit ? `/${loanAccountTransactionId}` : ""
              }`,
              data,
            });
          }}
        >
          <Card>
            <GridContainer columns={2} noPadding>
              <Field
                name="date"
                component={DatePicker}
                label="Date"
                required
                fillWidth
                allBorders
              />
              <Field
                name="amount"
                component={TextField}
                label="Amount"
                required
                fillWidth
                allBorders
                type="number"
              />
              <Field
                name="note"
                component={TextField}
                label="Note"
                fillWidth
                allBorders
                isArea
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
        </Formik>
      </PageContainer>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default TransactionForm;

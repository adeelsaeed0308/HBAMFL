import {
  Button,
  DatePicker,
  DividerHorizontal,
  Dropdown,
  FormikSubmit,
  GridContainer,
  ItemSplitter,
  PageContainer,
  TextField,
  useAxios,
  useGoBack,
  useLoanAccounts,
} from "common";
import { useThemeFlip } from "containers";
import { Field, Formik } from "formik";
import React from "react";
import { useParams } from "react-router-dom";
import validationSchema from "../validationSchema";
import { Card } from "./styles";

const DueDateForm = ({ initialValues, isEdit, loanAccount }) => {
  const { loanAccountDueDateId } = useParams();
  const loanAccounts = useLoanAccounts();
  useThemeFlip();
  const onComplete = useGoBack();
  const { callAxios, loading } = useAxios({
    alertSuccess: `Due Date Added Successfully!`,
    onComplete,
  });

  return (
    <PageContainer>
      <h1>{isEdit ? "Edit" : "Add"} Due Date</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/loanAccountDueDates${
              isEdit ? `/${loanAccountDueDateId}` : ""
            }`,
            data,
          });
        }}
      >
        <Card>
          <GridContainer columns={2} noPadding>
            <Field
              name="loanAccount"
              component={Dropdown}
              label="Loan Account"
              required
              fillWidth
              allBorders
              options={loanAccounts}
              disabled={!!loanAccount}
            />
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
};

export default DueDateForm;

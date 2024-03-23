import {
  Column,
  DatePicker,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  sortAndFormatOptions,
  TextField,
} from "common";
import { Field, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";

const FollowUpForm = ({ onSubmit, emails = [], followUp }) => {
  const viaOptions = sortAndFormatOptions({
    list: ["Email", "Online Form", "Phone Number", "LinkedIn", "Show"],
    valueKey: (v) => v,
    labelKey: (l) => l,
  });
  return (
    <div>
      <h3>Follow Up</h3>
      <Formik
        {...formikSchema}
        initialValues={followUp || formikSchema.initialValues}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <FormWrapper>
            <Column>
              <Field
                name="via"
                options={viaOptions}
                component={Dropdown}
                label="Via"
              />
              {values.via === "Email" && (
                <Field
                  name="email"
                  component={TextField}
                  label="Email *"
                  suggestions={emails}
                />
              )}
              <Field name="date" component={DatePicker} label="Date" />
              <Field name="notes" component={TextField} label="Notes" isArea />
            </Column>
            <FormikSubmit>Add Follow Up</FormikSubmit>
          </FormWrapper>
        )}
      </Formik>
    </div>
  );
};

export default FollowUpForm;

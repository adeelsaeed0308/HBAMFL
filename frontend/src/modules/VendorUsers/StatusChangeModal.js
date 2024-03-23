import {
  Column,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  getSourcingStatusList,
} from "common";
import { Field, Formik } from "formik";
import React from "react";

const StatusChangeModal = ({ status, onSubmit, isOpen }) => {
  const statusOptions = getSourcingStatusList().filter(
    (s) => isOpen || !["Ordered", "Closed", "Open"].includes(s.value)
  );
  return (
    <Formik
      initialValues={{ status }}
      onSubmit={({ status }) => {
        onSubmit(status);
      }}
    >
      <FormWrapper>
        <Column>
          <h3>Change Status</h3>
          <Field
            component={Dropdown}
            options={statusOptions}
            label="Status"
            name="status"
          />
        </Column>
        <FormikSubmit>Update Status</FormikSubmit>
      </FormWrapper>
    </Formik>
  );
};

export default StatusChangeModal;

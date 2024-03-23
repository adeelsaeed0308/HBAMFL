import {
  Column,
  DatePicker,
  FormikSubmit,
  FormWrapper,
  TextField,
  useUploadFile,
} from "common";
import { Field, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";

const OrderForm = ({ onSubmit, order }) => {
  const { uploadFile, uploadLoading } = useUploadFile();
  return (
    <div>
      <h3>Order</h3>
      <Formik
        {...formikSchema}
        initialValues={order || formikSchema.initialValues}
        onSubmit={onSubmit}
      >
        {({ values, handleChange }) => (
          <FormWrapper>
            <Column>
              <Field
                name="orderDate"
                component={DatePicker}
                label="Order Date"
                required
              />
              <Field
                name="pickupDate"
                component={DatePicker}
                label="Pickup Date"
              />
              {!values.invoice ? (
                <div>No Invoice Attached</div>
              ) : (
                <div>Invoice Attached: {values.invoice.split("__")?.[2]}</div>
              )}
              <input
                type="file"
                accept="*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.files = null;
                  e.target.value = null;
                  if (!file) return;
                  uploadFile(file).then(({ data: { filename } }) =>
                    handleChange({
                      target: { name: "invoice", value: filename },
                    })
                  );
                }}
              />
              <Field
                name="total"
                component={TextField}
                label="Total"
                type="number"
              />
            </Column>
            <FormikSubmit loading={uploadLoading}>
              {order ? "Edit" : "Add"} Order
            </FormikSubmit>
          </FormWrapper>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;

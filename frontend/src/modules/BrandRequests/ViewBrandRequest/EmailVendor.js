import {
  Dropdown,
  FormikSubmit,
  FormWrapper,
  getContactLabel,
  isMissing,
  sortAndFormatOptions,
  TextField,
  useAxios,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";

const formikSchema = (title, body = "") => ({
  initialValues: {
    contactIds: [],
    title,
    body,
  },
  validationSchema: yup.object({
    contactIds: yup
      .array()
      .of(yup.string().required())
      .min(1, "Please Select at least 1 contact.")
      .required(isMissing("Contacts")),
    title: yup.string().required(),
    body: yup.string().required(),
  }),
});

const EmailVendor = ({
  row,
  close,
  title,
  body,
  reloadTable = () => {},
}) => {
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendorcontacts",
      params: {
        filters: {
          vendor: row.vendor,
        },
      },
    },
  });

  const { callAxios, loading } = useAxios({
    alertSuccess: "Vendor Emailed Successfully",
    onComplete: close,
  });

  const contacts = response
    ? sortAndFormatOptions({
        list: response.data.data,
        labelKey: (c) => getContactLabel(c),
      })
    : [];

  if (response && contacts.length === 0) {
    return <div>No contacts added for vendor yet.</div>;
  }

  return (
    <Formik
      {...formikSchema(title, body)}
      onSubmit={(values) => {
        callAxios({
          method: "POST",
          url: "/vendorcontacts/emailreport",
          data: { ...values, ids: [row.id] },
        }).then(() => {
          reloadTable && reloadTable();
        });
      }}
    >
      <FormWrapper style={{ width: "300px" }}>
        <Form>
          <h2 style={{ textAlign: "center" }}>Email Vendor</h2>
          <Field
            name="contactIds"
            label="Contacts"
            component={Dropdown}
            isMulti
            options={contacts}
            required
          />
          <Field name="title" component={TextField} label="Title" required />
          <Field
            name="body"
            component={TextField}
            label="Body"
            isArea
            required
          />
        </Form>
        <FormikSubmit loading={loading}>Email</FormikSubmit>
      </FormWrapper>
    </Formik>
  );
};

export default EmailVendor;

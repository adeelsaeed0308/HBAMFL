import {
  Button,
  Column,
  ContactEmailForm,
  contactEmailFormInitialValues,
  contactEmailFormValidationSchema,
  FormikSubmit,
  FormWrapper,
  Spinner,
  TextField,
  useAxios,
} from "common";
import { Field, Form, Formik } from "formik";
import { uniq } from "ramda";
import React, { useState } from "react";
import * as yup from "yup";

const formikSchema = (brandEmails = []) => ({
  initialValues: contactEmailFormInitialValues(brandEmails, true),
  validationSchema: yup.object(contactEmailFormValidationSchema),
});

const formikSchemaForContactAdd = {
  initialValues: {
    name: "",
    email: "",
  },
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
  }),
};

const EmailContact = ({
  ids,
  close,
  contacts: initialContacts,
  vendor,
  onActionComplete,
}) => {
  const [contacts, setContacts] = useState(initialContacts || []);
  const [addContact, setAddContact] = useState(false);

  const { response } = useAxios({
    callOnLoad: {
      url: "/vendorRequests",
      method: "GET",
      params: { filters: { _id: ids }, populate: "brandRequest" },
    },
  });

  const { callAxios, loading } = useAxios({
    alertSuccess: "Email Sent Successfully!",
    onComplete: () => {
      close();
    },
  });
  const { callAxios: contactAxios, loading: contactLoading } = useAxios({
    alertSuccess: "Contact Added Successfully!",
    onComplete: (d) => {
      onActionComplete();
      setContacts((prev) => [...prev, d.data]);
    },
  });

  if (response) {
    const emails = uniq(
      response.data.data
        .map(
          (vr) =>
            vr.brandRequest?.brandEmail && {
              name: vr.brandRequest.brandName,
              email: vr.brandRequest.brandEmail,
            }
        )
        .filter(Boolean)
    );
    if (contacts.length === 0) {
      return (
        <div>
          No contacts added for vendor yet.
          {!addContact && (
            <Button onClick={() => setAddContact(true)}>Add Contact</Button>
          )}
          {addContact && (
            <Formik
              {...formikSchemaForContactAdd}
              onSubmit={(values) => {
                contactAxios({
                  method: "POST",
                  url: "/vendorcontacts",
                  data: { ...values, vendor },
                });
              }}
            >
              <FormWrapper>
                <Form>
                  <Field
                    name="name"
                    label="Name"
                    required
                    component={TextField}
                  />
                  <Field
                    name="email"
                    label="Email"
                    required
                    component={TextField}
                  />
                </Form>
                <FormikSubmit loading={contactLoading}>
                  Add Contact
                </FormikSubmit>
              </FormWrapper>
            </Formik>
          )}
        </div>
      );
    }

    return (
      <Formik
        {...formikSchema(emails)}
        onSubmit={(data) => {
          callAxios({
            method: "POST",
            url: "/vendorcontacts/emailreport",
            data: { ...data, ids },
          });
        }}
      >
        <FormWrapper style={{ width: "300px" }}>
          <Column>
            <h3>Email Report to Contact</h3>
            <ContactEmailForm contacts={contacts} sendEmail />
          </Column>
          <FormikSubmit loading={loading}>Send</FormikSubmit>
        </FormWrapper>
      </Formik>
    );
  }

  return <Spinner />;
};

export default EmailContact;

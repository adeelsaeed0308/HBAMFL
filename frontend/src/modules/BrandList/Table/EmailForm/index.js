import {
  Button,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  TextField,
  useAxios,
  usePrevEmails,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";
import { Container } from "./styles";

const EmailForm = ({ close, selectedCategoryIds = [] }) => {
  const prevEmailsOptions = usePrevEmails();
  const { callAxios: sendEmail, loading } = useAxios({
    alertSuccess: "Email Successfully Sent!",
    onComplete: () => {
      close();
    },
  });
  return (
    <Container>
      <h3>Email Brand List</h3>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          sendEmail({
            method: "POST",
            url: `/brandList/email`,
            data: {
              to: data.to.join(","),
              cc: data.cc?.join(","),
              bcc: data.bcc?.join(","),
              subject: data.subject,
              html: data.html,
            },
            params: {
              categoryIds: selectedCategoryIds.join(","),
            },
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Field
              name="to"
              component={Dropdown}
              label="To"
              options={prevEmailsOptions}
              isClearable
              isMulti
              isCreatable
              fillWidth
            />
            <Field
              name="cc"
              component={Dropdown}
              label="CC"
              options={prevEmailsOptions}
              isClearable
              isMulti
              isCreatable
              fillWidth
            />
            <Field
              name="bcc"
              component={Dropdown}
              label="BCC"
              options={prevEmailsOptions}
              isClearable
              isMulti
              isCreatable
              fillWidth
            />
            <Field
              name="subject"
              component={TextField}
              label="Subject"
              required
              fillWidth
            />
            <Field
              name="html"
              component={TextField}
              label="Body"
              required
              isArea
            />
          </Form>
          <ItemSplitter>
            <Button secondary>Cancel</Button>
            <FormikSubmit loading={loading}>Submit</FormikSubmit>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </Container>
  );
};

export default EmailForm;

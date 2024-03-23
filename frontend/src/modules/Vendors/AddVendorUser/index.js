import {
  Button,
  FormikSubmit,
  FormWrapper,
  FullPageLoad,
  ItemSplitter,
  PageContainer,
  TextField,
  useAxios,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import formikSchema from "./formikSchema";

const AddUser = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `vendors/${vendorId}` },
  });
  const { callAxios, loading } = useAxios({
    alertSuccess: `User Added Successfully`,
    onComplete: goBack,
  });

  if (!response) return <FullPageLoad fillWidth />;

  return (
    <PageContainer>
      <h1>Add User for {response.data.name}</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: "POST",
            url: `/vendors/${vendorId}/addUser`,
            data,
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Field name="email" component={TextField} label="Email" required />
            <Field name="name" component={TextField} label="Name" required />
          </Form>
          <ItemSplitter autoWidth>
            <FormikSubmit loading={loading}>Add</FormikSubmit>
            <Button secondary onClick={goBack}>
              Cancel
            </Button>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default AddUser;

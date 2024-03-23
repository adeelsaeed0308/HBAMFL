import { FormikSubmit, TextField } from "common";
import { Field, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";
import { Container } from "./styles";

const BrandAddLine = ({ onSubmit, loading }) => {
  return (
    <Formik {...formikSchema} onSubmit={onSubmit}>
      <Container>
        <Field component={TextField} name="name" required label="Name" />
        <FormikSubmit loading={loading} fit>
          +
        </FormikSubmit>
      </Container>
    </Formik>
  );
};

export default BrandAddLine;

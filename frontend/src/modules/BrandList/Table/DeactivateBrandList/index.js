import {
  Button,
  Column,
  FormikSubmit,
  RowFlex,
  TextField,
  theme,
  useAxios,
} from "common";
import { Field, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";
import { Container } from "./styles";

const DeactivateBrandList = ({ brand, close, refetch }) => {
  const { callAxios, loading } = useAxios({
    alertSuccess: "Item Deactivated Successfully",
  });

  return (
    <Formik
      {...formikSchema}
      onSubmit={(data) => {
        callAxios({
          method: "PUT",
          url: `/brandList/${brand.id}/deactivate`,
          data,
        }).then(() => {
          refetch();
          close();
        });
      }}
    >
      <Container>
        <Column>
          <h3 style={{ color: theme.colors.danger }}>
            Deactivate {brand.name}
          </h3>
          <Field
            component={TextField}
            name="inactiveReason"
            label="Reason"
            required
            isArea
          />
        </Column>
        <RowFlex>
          <FormikSubmit loading={loading} fit danger>
            Deactivate
          </FormikSubmit>
          <Button secondary onClick={close} fit loading={loading}>
            Cancel
          </Button>
        </RowFlex>
      </Container>
    </Formik>
  );
};

export default DeactivateBrandList;

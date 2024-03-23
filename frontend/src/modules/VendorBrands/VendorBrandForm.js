import {
  Button,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  PageContainer,
  routing,
  TextField,
  useAxios,
  useCountries,
  useVendors,
} from "common";
import { Field, Form, Formik } from "formik";
import { dissoc } from "ramda";
import React from "react";
import { useNavigate } from "react-router-dom";

const VendorBrandForm = ({ isEdit, formikSchema }) => {
  const countries = useCountries();
  const navigate = useNavigate();
  const goBack = () => navigate(routing.vendorBrands.root);
  const { callAxios, loading } = useAxios({
    alertSuccess: `Price Sheet Vendor ${
      isEdit ? "Updated" : "Added"
    } Successfully!`,
    onComplete: goBack,
  });

  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"} Price Sheet Vendor</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/vendorBrands${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", data),
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Field name="name" component={TextField} label="Name" required />
            <Field
              name="country"
              component={Dropdown}
              label="Country"
              required
              options={countries}
            />
            <Field name="code" component={TextField} label="Code" />
          </Form>
          <ItemSplitter autoWidth>
            <FormikSubmit loading={loading}>
              {isEdit ? "Update" : "Add"}
            </FormikSubmit>
            <Button secondary onClick={goBack}>
              Cancel
            </Button>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default VendorBrandForm;

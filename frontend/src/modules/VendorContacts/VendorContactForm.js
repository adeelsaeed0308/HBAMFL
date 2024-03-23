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
  useVendors,
} from "common";
import { Field, Form, Formik } from "formik";
import { dissoc } from "ramda";
import React from "react";
import { useNavigate } from "react-router-dom";

const VendorForm = ({ isEdit, formikSchema }) => {
  const vendors = useVendors();
  const navigate = useNavigate();
  const goBack = () => navigate(routing.vendorContacts.root);
  const { callAxios, loading } = useAxios({
    alertSuccess: `Vendor ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: goBack,
  });

  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"} Vendor</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/vendorcontacts${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", data),
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Field
              name="vendor"
              component={Dropdown}
              label="Vendor"
              required
              options={vendors}
            />
            <Field name="name" component={TextField} label="Name" required />
            <Field name="email" component={TextField} label="Email" required />
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

export default VendorForm;

import {
  Button,
  Column,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  PageContainer,
  routing,
  TextField,
  Toggle,
  useAxios,
  useCountries,
  useToast,
} from "common";
import { Field, Form, Formik } from "formik";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorForm = ({ isEdit, formikSchema }) => {
  const countries = useCountries();
  const navigate = useNavigate();
  const goBack = () => navigate(routing.vendors.root);
  const [loading, setLoading] = useState(false);
  const { onError, alertSuccess } = useToast();
  const { callAxios } = useAxios();

  const mutate = async (values) => {
    const { data } = await callAxios({
      method: isEdit ? "PUT" : "POST",
      url: `/vendors${isEdit ? `/${values.id}` : ""}`,
      data: { name: values.name, country: values.country, notes: values.notes, order: values.order },
    });
    if (!isEdit && values.addContact) {
      await callAxios({
        method: "POST",
        url: `/vendorcontacts`,
        data: {
          vendor: data.id,
          name: values.contactName,
          email: values.email,
          order: values.order,
        },
      });
    }
  };

  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"} Vendor</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          setLoading(true);
          mutate(data)
            .then(() => {
              alertSuccess("Vendor submitted successfully");
              goBack();
            })
            .catch(onError)
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        {({ values }) => {
          return (
            <FormWrapper>
              <Form>
                <Column>
                  <Field
                    name="name"
                    component={TextField}
                    label="Name"
                    required
                  />
                  <Field
                    name="country"
                    component={Dropdown}
                    label="Country"
                    required
                    options={countries}
                  />
                  {/* <Field
                    name="order"
                    component={TextField}
                    required
                    label="Order number"
                  /> */}
                  <Field
                    name="notes"
                    component={TextField}
                    isArea
                    label="Notes"
                  />
                  {!isEdit && (
                    <Field
                      name="addContact"
                      component={Toggle}
                      label="Add Contact"
                    />
                  )}
                  {values.addContact && (
                    <Fragment>
                      <Field
                        name="contactName"
                        component={TextField}
                        label="Contact Name"
                        required
                      />
                      <Field
                        name="email"
                        component={TextField}
                        label="Contact Email"
                        required
                      />
                    </Fragment>
                  )}
                </Column>
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
          );
        }}
      </Formik>
    </PageContainer>
  );
};

export default VendorForm;

import {
  ContactEmailForm,
  contactEmailFormInitialValues,
  contactEmailFormValidationSchema,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  isMissing,
  useAxios,
  useLoginContext,
  useVendors,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    vendor: [],
    ...contactEmailFormInitialValues,
  },
  validationSchema: yup.object({
    vendor: yup
      .array()
      .of(yup.string().required(isMissing("Vendor")))
      .required(),
    ...contactEmailFormValidationSchema,
  }),
};

const VendorAddForm = ({ close, ids = [], reloadTable, onActionComplete }) => {
  const vendors = useVendors();
  const { currentUser } = useLoginContext();
  const { callAxios, loading } = useAxios({
    alertSuccess: "Requests submitted successfully",
    onComplete: () => {
      close();
      reloadTable();
      onActionComplete();
    },
  });

  const contacts = vendors.reduce(
    (acc, vendor) => [...acc, ...(vendor.contacts || [])],
    []
  );

  return (
    <div>
      <h3>Add New Vendors</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          const data = {
            ...values,
            brandRequestIds: ids,
            requestBy: currentUser?.id,
          };
          callAxios({ method: "POST", url: "/vendorrequests/bulk", data });
        }}
      >
        {({ values }) => {
          return (
            <FormWrapper>
              <Form>
                <Field
                  component={Dropdown}
                  isMulti
                  options={vendors}
                  label="Vendors"
                  required
                  name="vendor"
                  disabled={values?.contactIds?.length > 0}
                />
                {values.vendor.length > 0 && (
                  <ContactEmailForm
                    contacts={contacts.filter((contact) =>
                      values.vendor.includes(contact.vendor)
                    )}
                  />
                )}
              </Form>
              <FormikSubmit loading={loading}>Submit</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};

export default VendorAddForm;

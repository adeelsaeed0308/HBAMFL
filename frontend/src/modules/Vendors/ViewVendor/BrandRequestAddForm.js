import {
  ContactEmailForm,
  contactEmailFormInitialValues,
  contactEmailFormValidationSchema,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  FullPageLoad,
  isMissing,
  useAxios,
  useBrandRequests,
  useLoginContext,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    brandRequest: "",
    ...contactEmailFormInitialValues,
  },
  validationSchema: yup.object({
    brandRequest: yup.string().required(isMissing("Brand")),
    ...contactEmailFormValidationSchema,
  }),
};

const BrandRequestAddForm = ({ close, vendor, reloadTable, contacts = [] }) => {
  const { brandRequests } = useBrandRequests();
  const { currentUser } = useLoginContext();
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendorRequests",
      params: { filters: { vendor }, limit: 100000 },
    },
  });
  const { callAxios, loading } = useAxios({
    onComplete: () => {
      close();
      reloadTable();
    },
    alertSuccess: "Brand Added Successfully!",
  });

  if (response) {
    const brandsToRemove = response.data.data.map((d) => d.brandRequest);
    return (
      <div>
        <h3>Add New Brand</h3>
        <Formik
          {...formikSchema}
          onSubmit={(values) => {
            callAxios({
              method: "POST",
              url: "/vendorRequests",
              data: {
                ...values,
                requestBy: currentUser?.id,
                vendor,
              },
            });
          }}
        >
          <FormWrapper>
            <Form>
              <Field
                component={Dropdown}
                options={brandRequests.filter(
                  (br) => !brandsToRemove.includes(br.value)
                )}
                label="Brand Request"
                required
                name="brandRequest"
              />
              <ContactEmailForm contacts={contacts} />
            </Form>
            <FormikSubmit loading={loading}>Submit</FormikSubmit>
          </FormWrapper>
        </Formik>
      </div>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default BrandRequestAddForm;

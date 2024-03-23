import {
  Dropdown,
  FormikSubmit,
  FormWrapper,
  FullPageLoad,
  isMissing,
  useAxios,
  useLoginContext,
  useVendors,
} from "common";
import { useToast } from "common/context/Toast";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    vendor: [],
  },
  validationSchema: yup.object({
    vendor: yup
      .array()
      .of(yup.string().required(isMissing("Vendor")))
      .required(),
  }),
};

const VendorAddForm = ({
  close,
  brandRequestId,
  onActionComplete,
  reloadTable,
}) => {
  const vendors = useVendors();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useLoginContext();
  const { onError, alertSuccess } = useToast();
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendorRequests",
      params: { filters: { brandRequest: brandRequestId }, limit: 1000000 },
    },
  });
  const { callAxios } = useAxios();

  const addVendors = async (vendorIds = []) => {
    for (const vendor of vendorIds) {
      await callAxios({
        method: "POST",
        url: "/vendorRequests",
        data: {
          vendor,
          requestBy: currentUser?.id,
          brandRequest: brandRequestId,
        },
      });
    }
  };

  if (response) {
    const vendorsToRemove = response.data.data.map((d) => d.vendor);
    return (
      <div>
        <h3>Add New Vendors</h3>
        <Formik
          {...formikSchema}
          onSubmit={(values) => {
            setLoading(true);
            addVendors(values.vendor)
              .then(() => {
                alertSuccess("Vendors Added Successfully");
                close();
                onActionComplete();
                reloadTable();
              })
              .catch(onError)
              .finally(() => setLoading(false));
          }}
        >
          <FormWrapper>
            <Form>
              <Field
                component={Dropdown}
                isMulti
                options={vendors.filter(
                  (v) => !vendorsToRemove.includes(v.value)
                )}
                label="Vendors"
                required
                name="vendor"
              />
            </Form>
            <FormikSubmit loading={loading}>Submit</FormikSubmit>
          </FormWrapper>
        </Formik>
      </div>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default VendorAddForm;

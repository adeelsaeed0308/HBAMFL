import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams } from "react-router-dom";
import validationSchema from "../validationSchema";
import VendorForm from "../VendorForm";

const EditVendor = () => {
  const { vendorId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/vendors/${vendorId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <VendorForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditVendor;

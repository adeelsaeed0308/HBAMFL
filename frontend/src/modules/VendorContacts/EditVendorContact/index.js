import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams } from "react-router-dom";
import validationSchema from "../validationSchema";
import VendorContactForm from "../VendorContactForm";

const EditVendorContact = () => {
  const { vendorContactId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/vendorcontacts/${vendorContactId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <VendorContactForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditVendorContact;

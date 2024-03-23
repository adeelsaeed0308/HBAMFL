import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams } from "react-router-dom";
import validationSchema from "../validationSchema";
import VendorBrandForm from "../VendorBrandForm";

const EditVendorBrand = () => {
  const { vendorBrandId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/vendorBrands/${vendorBrandId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <VendorBrandForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditVendorBrand;

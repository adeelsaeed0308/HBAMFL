import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams } from "react-router-dom";
import BrandRequestForm from "../BrandRequestForm";
import validationSchema from "../validationSchema";

const EditBrandRequest = () => {
  const { brandRequestId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/brandRequests/${brandRequestId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <BrandRequestForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditBrandRequest;

import { useLoginContext } from "common";
import React from "react";
import BrandRequestForm from "../BrandRequestForm";
import formikSchema from "./formikSchema";

const AddBrandRequest = () => {
  const { currentUser } = useLoginContext();
  return <BrandRequestForm formikSchema={formikSchema(currentUser)} />;
};

export default AddBrandRequest;

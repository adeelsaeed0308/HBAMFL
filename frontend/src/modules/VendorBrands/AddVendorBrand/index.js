import React from "react";
import formikSchema from "./formikSchema";
import VendorBrandForm from "../VendorBrandForm";

const AddVendorBrand = () => {
  return <VendorBrandForm formikSchema={formikSchema} />;
};

export default AddVendorBrand;

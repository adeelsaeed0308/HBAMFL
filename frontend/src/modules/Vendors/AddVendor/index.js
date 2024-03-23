import React from "react";
import VendorForm from "../VendorForm";
import formikSchema from "./formikSchema";

const AddVendor = () => {
  return <VendorForm formikSchema={formikSchema} />;
};

export default AddVendor;

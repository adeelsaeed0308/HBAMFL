import React from "react";
import VendorContactForm from "../VendorContactForm";
import formikSchema from "./formikSchema";

const AddVendorContact = () => {
  return <VendorContactForm formikSchema={formikSchema} />;
};

export default AddVendorContact;

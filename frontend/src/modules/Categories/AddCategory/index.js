import React from "react";
import CategoryForm from "../CategoryForm";
import formikSchema from "./formikSchema";

const AddCategory = ({ onCancel, onComplete }) => {
  return (
    <CategoryForm
      formikSchema={formikSchema}
      onCancel={onCancel}
      onComplete={onComplete}
    />
  );
};

export default AddCategory;

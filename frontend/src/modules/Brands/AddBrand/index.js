import { FullPageLoad, useAxios, useToast } from "common";
import React from "react";
import { useSearchParams } from "react-router-dom";
import BrandForm from "../BrandForm";
import formikSchema from "./formikSchema";

const AddBrand = () => {
  const [search] = useSearchParams();
  const { onError } = useToast();
  const parentBrandId = search.get("brand");

  const { response, loading: parentBrandLoading } = useAxios({
    callOnLoad: {
      method: "GET",
      url: parentBrandId && `/brands/${parentBrandId}`,
    },
    onError,
  });

  if (parentBrandLoading) return <FullPageLoad fillWidth />;
  const brand = response?.data;
  return (
    <BrandForm formikSchema={formikSchema(brand)} parentBrand={brand?.name} />
  );
};

export default AddBrand;

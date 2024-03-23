import { FullPageLoad, useAxios } from "common";
import React from "react";
import { useParams } from "react-router-dom";
import BrandForm from "../BrandForm";
import validationSchema from "../validationSchema";

const EditBrand = () => {
  const { brandId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: `/brands/${brandId}` },
  });

  if (!response) return <FullPageLoad fillWidth />;

  const {
    data: {
      id,
      name,
      category,
      minimumMargin,
      minimumOrderDollarAmount,
      minimumOrderItems,
      maximumOrderDollarAmount,
      maximumOrderItems,
      commissionCost,
      shippingCost,
      otherCosts,
      soldByCaseOnly,
      currency,
      maximumMargin,
      suggestedMargin,
      fobPoint,
      leadTime,
      specialDiscountNotes,
      notes,
    },
  } = response;
  const formikSchema = {
    initialValues: {
      id,
      name,
      maximumMargin,
      suggestedMargin,
      category,
      minimumMargin,
      minimumOrderDollarAmount,
      minimumOrderItems,
      maximumOrderDollarAmount,
      maximumOrderItems,
      commissionCost,
      shippingCost,
      otherCosts,
      soldByCaseOnly,
      currency: currency?.code,
      fobPoint,
      leadTime,
      specialDiscountNotes,
      notes,
    },
    validationSchema,
  };
  return <BrandForm formikSchema={formikSchema} isEdit />;
};

export default EditBrand;

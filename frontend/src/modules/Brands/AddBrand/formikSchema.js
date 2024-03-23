import validationSchema from "../validationSchema";

const formikSchema = (brand) => ({
  initialValues: {
    brand: brand?.id,
    name: "",
    image: null,
    category: brand?.category,
    description: "",
    minimumMargin: 0,
    maximumMargin: null,
    suggestedMargin: 0,
    minimumOrderDollarAmount: 0,
    minimumOrderItems: 0,
    maximumOrderDollarAmount: null,
    maximumOrderItems: null,
    commissionCost: null,
    shippingCost: null,
    otherCosts: null,
    soldByCaseOnly: null,
    currency: brand?.currency.code || "USD",
    lineItemsFile: null,
  },
  validationSchema,
});

export default formikSchema;

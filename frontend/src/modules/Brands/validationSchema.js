import { axiosInstance, isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup
    .string()
    .required(isMissing())
    .test(
      "isNameUnique",
      "Brand with same name already exists",
      async (name, object) => {
        try {
          let res = await axiosInstance({
            method: "GET",
            url: `/brands/${object?.parent?.id || "new"}/isNameUnique/${name}`,
            withCredentials: true,
          });

          return res.data;
        } catch (e) {
          return false;
        }
      }
    ),
  image: yup.mixed().nullable(),
  category: yup.string().nullable(),
  minimumMargin: yup.number().required("Required").min(1, "Min margin is 1"),
  maximumMargin: yup.number().nullable(),
  suggestedMargin: yup.number().nullable(),
  minimumOrderDollarAmount: yup.number().nullable(),
  minimumOrderItems: yup.number().nullable(),
  maximumOrderDollarAmount: yup.number().nullable(),
  maximumOrderItems: yup.number().nullable(),
  commissionCost: yup.number().nullable(),
  shippingCost: yup.number().nullable(),
  otherCosts: yup.number().nullable(),
  soldByCaseOnly: yup
    .boolean()
    .required(isMissing("Sold By Case"))
    .typeError(isMissing("Sold By Case")),
  currency: yup.string().required(),
  lineItemsFile: yup.mixed().nullable(),
  fobPoint: yup.string().nullable(),
  leadTime: yup.string().nullable(),
  specialDiscountNotes: yup.string().nullable(),
  notes: yup.string().nullable(),
});

export default validationSchema;

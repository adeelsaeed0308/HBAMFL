import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    orderDate: new Date(),
    pickupDate: null,
    invoice: null,
    total: null,
  },
  validationSchema: yup.object({
    orderDate: yup.date().required(isMissing("Order Date")),
  }),
};

export default formikSchema;

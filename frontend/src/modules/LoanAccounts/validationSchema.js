import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(isMissing("Name")),
  amount: yup.number().required(isMissing("Amount")),
  creditLimit: yup.number().required(isMissing("Credit Limit")),
});

export default validationSchema;

import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  date: yup.date().required(isMissing("Date")),
  SO: yup.string().required(isMissing("SO")).min(4, isMissing("SO")),
  amount: yup.number().required(isMissing("Amount")),
});

export default validationSchema;

import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  loanAccount: yup.string().required(isMissing("Loan Account")),
  date: yup.date().required(isMissing("Date")),
  amount: yup.number().required(isMissing("Amount")),
});

export default validationSchema;

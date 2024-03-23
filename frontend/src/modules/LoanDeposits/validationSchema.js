import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  date: yup.date().required(isMissing("Date")),
  PO: yup.string().required(isMissing("PO")).min(4, isMissing("PO")),
  SO: yup.string().required(isMissing("SO")).min(4, isMissing("SO")),
  loan: yup.string().nullable(),
  depositTotal: yup.number().required(isMissing("Deposit Total")),
});

export default validationSchema;

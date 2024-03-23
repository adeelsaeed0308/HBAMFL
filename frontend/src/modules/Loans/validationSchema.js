import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  date: yup.date().required(isMissing("Date")),
  PO: yup.string().required(isMissing("PO")).min(4, isMissing("PO")),
  brand: yup.string().nullable(),
  billTotal: yup.number().nullable(),
  amountDrawn: yup.number().required(isMissing("Amount Drawn")),
  paidInFull: yup.boolean().required(isMissing("Paid In Full")),
  sos: yup
    .array()
    .of(
      yup.object({
        SO: yup.string().required(),
        amount: yup.number().nullable(),
      })
    )
    .nullable(),
});

export default validationSchema;

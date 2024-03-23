import { loanPOPrefix, loanSOPrefix } from "common";
import validationSchema from "../validationSchema";

const formikSchema = (loan) => ({
  initialValues: {
    date: new Date().toISOString(),
    loan,
    SO: loanSOPrefix,
    PO: loanPOPrefix,
    depositTotal: undefined,
  },
  validationSchema,
});

export default formikSchema;

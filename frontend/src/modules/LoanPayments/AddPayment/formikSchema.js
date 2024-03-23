import { loanSOPrefix } from "common";
import validationSchema from "../validationSchema";

const formikSchema = (loan) => ({
  initialValues: {
    date: new Date().toISOString(),
    loan,
    SO: loanSOPrefix,
    paid: true,
  },
  validationSchema,
});

export default formikSchema;

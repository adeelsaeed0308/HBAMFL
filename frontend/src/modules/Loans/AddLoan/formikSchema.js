import { loanPOPrefix } from "common";
import validationSchema from "../validationSchema";

const formikSchema = {
  initialValues: {
    date: new Date(),
    PO: loanPOPrefix,
    brand: "",
    paidInFull: false,
    sos: [],
    deposits: [],
  },
  validationSchema,
};

export default formikSchema;

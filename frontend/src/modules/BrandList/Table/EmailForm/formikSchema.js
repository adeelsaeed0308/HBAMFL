import { emailSchemaObject } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    to: [],
    cc: [],
    bcc: [],
    subject: "Brand List",
    html: "Please find attached the current Brand List",
  },
  validationSchema: yup.object(emailSchemaObject),
};

export default formikSchema;

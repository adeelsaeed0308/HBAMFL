import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  vendor: yup.string().required(isMissing("Vendor")),
  name: yup.string().required(isMissing("Name")),
  email: yup.string().email().required(isMissing("Email")),
});

export default validationSchema;

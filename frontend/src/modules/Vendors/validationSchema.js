import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(isMissing("Name")),
  country: yup.string().required(isMissing("Country")),
  notes: yup.string().nullable(),
});

export default validationSchema;

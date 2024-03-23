import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = (sos = []) => ({
  initialValues: {
    sos,
  },
  validationSchema: yup.object({
    sos: yup.array().of(
      yup.object({
        SO: yup.string().required(isMissing("SO")).min(4, isMissing("SO")),
        amount: yup.number().nullable(),
      })
    ),
  }),
});

export default formikSchema;

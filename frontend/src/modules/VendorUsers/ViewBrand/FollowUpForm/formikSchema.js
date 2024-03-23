import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    via: "",
    email: null,
    date: new Date().toISOString(),
    notes: "",
  },
  validationSchema: yup.object({
    via: yup.string().required(isMissing("Via")),
    email: yup.string().when("via", {
      is: "Email",
      then: yup.string().email(isMissing("Email")).required(isMissing("Email")),
      otherwise: yup.string().nullable(),
    }),
    date: yup.date().required(),
    notes: yup.string().nullable(),
  }),
};

export default formikSchema;

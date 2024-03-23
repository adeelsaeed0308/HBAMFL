import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    inactiveReason: "",
  },
  validationSchema: yup.object({
    inactiveReason: yup.string().required(isMissing("Reason")),
  }),
};

export default formikSchema;

import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    file: null,
  },
  validationSchema: yup.object({
    file: yup.mixed().required(isMissing("File")),
  }),
};

export default formikSchema;

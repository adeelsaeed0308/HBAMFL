import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = {
  initialValues: { name: "" },
  validationSchema: yup.object({
    name: yup.string().required(isMissing("Name")),
  }),
};

export default formikSchema;

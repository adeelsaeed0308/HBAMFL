import { isMissing } from "common";
import * as yup from "yup";

const formikSchema = (initialValues = { name: "" }) => ({
  initialValues,
  validationSchema: yup.object({
    name: yup.string().required(isMissing("Name")),
    image: yup.mixed().nullable(),
    category: yup.string().required(isMissing("Category")),
    class: yup.string().required(isMissing("Class")),
  }),
});

export default formikSchema;

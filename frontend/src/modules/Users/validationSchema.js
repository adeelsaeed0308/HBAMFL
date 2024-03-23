import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required("Name Missing"),
  email: yup.string().email("Must be a valid Email").required("Email Missing"),
  priceSheetsRole: yup.string(),
  sourcingRole: yup.string(),
  brandListRole: yup.string(),
  admin: yup.boolean().required(),
});

export default validationSchema;

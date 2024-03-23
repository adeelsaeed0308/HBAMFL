import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required("Name Missing"),
  email: yup.string().email("Must be a valid Email").required("Email Missing"),
});

const formikSchema = {
  initialValues: {
    name: "",
    email: "",
    vendorRole: "Admin",
    admin: false,
  },
  validationSchema,
};

export default formikSchema;

import validationSchema from "../validationSchema";

const formikSchema = {
  initialValues: {
    name: "",
    email: "",
    vendor: "",
  },
  validationSchema,
};

export default formikSchema;

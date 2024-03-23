import validationSchema from "../validationSchema";

const formikSchema = {
  initialValues: {
    name: "",
    country: "",
    code: "",
  },
  validationSchema,
};

export default formikSchema;

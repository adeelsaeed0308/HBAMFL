import validationSchema from "../validationSchema";

const formikSchema = {
  initialValues: {
    name: "",
    amount: undefined,
    creditLimit: undefined,
  },
  validationSchema,
};

export default formikSchema;

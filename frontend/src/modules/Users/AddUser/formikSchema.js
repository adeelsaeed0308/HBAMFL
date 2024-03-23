import validationSchema from "../validationSchema";

const formikSchema = {
  initialValues: {
    name: "",
    email: "",
    priceSheetsRole: "",
    sourcingRole: "",
    brandListRole: "",
    admin: false,
  },
  validationSchema,
};

export default formikSchema;
